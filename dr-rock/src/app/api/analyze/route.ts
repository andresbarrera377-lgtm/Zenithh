import { AnalysisError, analyzeRock } from "@/lib/ai/analyze-rock";
import { getAiConfig } from "@/lib/ai/config";
import { FieldContextSchema, type AnalysisErrorCode, type AnalyzeResponse, type FieldContext } from "@/lib/analysis/schema";
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

/** Multipart overhead allowance on top of the image itself (boundaries, context field). */
const MAX_BODY_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

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
    return errorResponse(413, "IMAGE_TOO_LARGE", "The image is too large. Please use a photo under 3.5 MB.");
  }

  // Read the body with a hard cap: a missing or false Content-Length must not let a client
  // stream an arbitrarily large upload into memory.
  const body = await readBodyWithLimit(request, MAX_BODY_BYTES);
  if (body === null) {
    return errorResponse(413, "IMAGE_TOO_LARGE", "The image is too large. Please use a photo under 3.5 MB.");
  }

  let form: FormData;
  try {
    form = await new Response(body, {
      headers: { "content-type": request.headers.get("content-type") ?? "" },
    }).formData();
  } catch {
    return errorResponse(400, "INVALID_REQUEST", "Expected a multipart form with an 'image' field.");
  }

  const image = form.get("image");
  if (!(image instanceof File)) {
    return errorResponse(400, "INVALID_REQUEST", "No image was received.");
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return errorResponse(413, "IMAGE_TOO_LARGE", "The image is too large. Please use a photo under 3.5 MB.");
  }

  const bytes = new Uint8Array(await image.arrayBuffer());
  const validation = validateImageBytes(bytes);
  if (!validation.ok) {
    const status = validation.code === "IMAGE_TOO_LARGE" ? 413 : validation.code === "UNSUPPORTED_IMAGE_TYPE" ? 415 : 400;
    return errorResponse(status, validation.code, validation.message);
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

  try {
    const { analysis, model } = await analyzeRock({
      imageBase64: Buffer.from(bytes).toString("base64"),
      mediaType: validation.mediaType,
      context,
      signal: request.signal,
    });
    const body: AnalyzeResponse = {
      ok: true,
      analysis,
      meta: { requestId, model, analyzedAt: new Date().toISOString(), durationMs: Date.now() - startedAt },
    };
    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AnalysisError) {
      const detail = getAiConfig().debugErrors ? error.detail : undefined;
      return errorResponse(error.status, error.code, error.message, error.retryAfterSeconds, detail);
    }
    console.error(`[dr-rock] ${requestId} unexpected error`, error);
    return errorResponse(500, "UNKNOWN", "Something went wrong during the analysis. Please try again.");
  }
}
