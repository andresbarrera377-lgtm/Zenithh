import type { AnalysisPhoto } from "@/lib/ai/analyze-core";
import { runAnalysis } from "@/lib/ai/analyze-rock";
import { getAiConfig } from "@/lib/ai/config";
import { MAX_PHOTOS, MAX_TOTAL_PHOTO_BYTES, isPhotoRole } from "@/lib/analysis/photos";
import { FieldContextSchema, type AnalysisErrorCode, type AnalyzeResponse, type FieldContext } from "@/lib/analysis/schema";
import { LOCALE_COOKIE, isLocale, pickLocale, type Locale } from "@/lib/i18n/config";
import { createJob } from "@/lib/server/analysis-jobs";
import { MAX_IMAGE_BYTES, validateImageBytes } from "@/lib/server/image-validation";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/server/rate-limit";
import { createId } from "@/lib/utils";

// Multimodal analysis with reasoning can take a while; give the platform room.
export const maxDuration = 300;

const config = getAiConfig();
const limiter = createRateLimiter({
  max: config.rateLimitMax,
  windowMs: config.rateLimitWindowSeconds * 1000,
});

/** Multipart overhead allowance on top of the photos (boundaries, context and role fields). */
const MAX_BODY_BYTES = MAX_TOTAL_PHOTO_BYTES + 64 * 1024;
const TOO_LARGE = "The photos are too large. Please use fewer or smaller photos.";

function errorResponse(
  status: number,
  code: AnalysisErrorCode,
  message: string,
  retryAfterSeconds?: number,
  detail?: string,
): Response {
  const body: AnalyzeResponse = { ok: false, error: { code, message, retryAfterSeconds, detail } };
  const headers: HeadersInit = { "Cache-Control": "no-store" };
  if (retryAfterSeconds) headers["Retry-After"] = String(retryAfterSeconds);
  return Response.json(body, { status, headers });
}

async function readBodyWithLimit(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

export async function POST(request: Request): Promise<Response> {
  const requestId = createId();
  const startedAt = Date.now();

  if (!getAiConfig().apiKeyConfigured) {
    return errorResponse(
      503,
      "AI_NOT_CONFIGURED",
      "The AI analysis service is not configured on this server. No identification was generated.",
    );
  }

  const rate = limiter.check(clientKeyFromHeaders(request.headers));
  if (!rate.allowed) {
    return errorResponse(
      429,
      "RATE_LIMITED",
      "You have reached the analysis limit for now. Please wait a few minutes and try again.",
      rate.retryAfterSeconds,
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return errorResponse(413, "IMAGE_TOO_LARGE", TOO_LARGE);
  }

  // Read the body with a hard cap: a missing or false Content-Length must not let a client
  // stream an arbitrarily large upload into memory.
  const body = await readBodyWithLimit(request, MAX_BODY_BYTES);
  if (body === null) {
    return errorResponse(413, "IMAGE_TOO_LARGE", TOO_LARGE);
  }

  let form: FormData;
  try {
    form = await new Response(body, {
      headers: { "content-type": request.headers.get("content-type") ?? "" },
    }).formData();
  } catch {
    return errorResponse(400, "INVALID_REQUEST", "Expected a multipart form with an 'image' field.");
  }

  // One to three photos of the same specimen, sent as repeated "image" fields; "photoRoles" says
  // what each one shows (overview, close-up, other view).
  const files = form.getAll("image").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return errorResponse(400, "INVALID_REQUEST", "No image was received.");
  }
  if (files.length > MAX_PHOTOS) {
    return errorResponse(400, "INVALID_REQUEST", `Send at most ${MAX_PHOTOS} photos.`);
  }
  let roles: unknown[] = [];
  try {
    const rawRoles = form.get("photoRoles");
    if (typeof rawRoles === "string" && rawRoles) roles = JSON.parse(rawRoles);
  } catch {
    roles = [];
  }

  const images: AnalysisPhoto[] = [];
  for (const [i, file] of files.entries()) {
    if (file.size > MAX_IMAGE_BYTES) {
      return errorResponse(413, "IMAGE_TOO_LARGE", TOO_LARGE);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const validation = validateImageBytes(bytes);
    if (!validation.ok) {
      const status = validation.code === "IMAGE_TOO_LARGE" ? 413 : validation.code === "UNSUPPORTED_IMAGE_TYPE" ? 415 : 400;
      return errorResponse(status, validation.code, validation.message);
    }
    const role = Array.isArray(roles) ? roles[i] : undefined;
    images.push({ data: Buffer.from(bytes).toString("base64"), mediaType: validation.mediaType, role: isPhotoRole(role) ? role : undefined });
  }

  let context: FieldContext | undefined;
  const rawContext = form.get("context");
  if (typeof rawContext === "string" && rawContext.trim()) {
    let json: unknown;
    try {
      json = JSON.parse(rawContext);
    } catch {
      return errorResponse(400, "INVALID_REQUEST", "Field notes could not be read.");
    }
    const parsed = FieldContextSchema.safeParse(json);
    if (!parsed.success) {
      return errorResponse(400, "INVALID_REQUEST", "Field notes are too long or malformed.");
    }
    context = parsed.data;
  }

  const rawLang = form.get("lang");
  const lang: Locale = isLocale(rawLang)
    ? rawLang
    : pickLocale(readCookie(request.headers.get("cookie"), LOCALE_COOKIE), request.headers.get("accept-language"));

  if (getAiConfig().jobMode === "netlify-background") {
    return startBackgroundJob(request, requestId, { images, context, lang });
  }

  const { status, body: result } = await runAnalysis(
    // Within a single request (max 300 s) the review pass only runs if the first one was quick.
    { images, context, lang, signal: request.signal, reviewBudgetMs: 110_000 },
    requestId,
    startedAt,
  );
  const headers: HeadersInit = { "Cache-Control": "no-store" };
  if (!result.ok && result.error.retryAfterSeconds) headers["Retry-After"] = String(result.error.retryAfterSeconds);
  return Response.json(result, { status, headers });
}

/**
 * Job mode (Netlify): store the validated photos, hand it to the background function and answer
 * 202 with a job id; the client polls /api/analyze/jobs/[id] for the report.
 */
async function startBackgroundJob(
  request: Request,
  jobId: string,
  job: { images: AnalysisPhoto[]; context?: FieldContext; lang: Locale },
): Promise<Response> {
  const token = createId();
  try {
    await createJob(jobId, { token, ...job });
    // DEPLOY_URL pins the call to this exact deploy, so route and worker always match.
    const origin = process.env.DEPLOY_URL || new URL(request.url).origin;
    const started = await fetch(`${origin}/.netlify/functions/analyze-background`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobId, token }),
    });
    if (!started.ok) throw new Error(`background function answered ${started.status}`);
  } catch (error) {
    console.error(`[dr-rock] ${jobId} could not start background analysis`, error);
    return errorResponse(503, "AI_UNAVAILABLE", "The analysis service could not start. Please try again in a moment.");
  }
  return Response.json({ pending: true, jobId, pollAfterMs: 2500 }, { status: 202, headers: { "Cache-Control": "no-store" } });
}

function readCookie(header: string | null, name: string): string | undefined {
  for (const part of (header ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}
