/**
 * Rock analysis engine. Kept free of Next.js-only imports so the Netlify background function
 * (netlify/functions/analyze-background.mts) can bundle it; app code imports it through the
 * `server-only` wrapper `analyze-rock.ts` so it can never reach a client bundle.
 */
import type { Locale } from "../i18n/config";
import Anthropic from "@anthropic-ai/sdk";
import { normalizeAnalysis } from "../analysis/normalize";
import type { UploadRole } from "../analysis/photos";
import type { AnalysisErrorCode, AnalyzeResponse, FieldContext, RockAnalysis } from "../analysis/schema";
import { fromWire, parseWireReport } from "../analysis/wire";
import type { AllowedMediaType } from "../server/image-validation";
import { getAiConfig } from "./ai-config";
import { ANALYSIS_SYSTEM_PROMPT, buildReviewPrompt, buildUserPrompt, photoLabel } from "./prompt";

export class AnalysisError extends Error {
  /** Upstream API status + message, returned to clients only when DR_ROCK_DEBUG_ERRORS=on. */
  detail?: string;

  constructor(
    public readonly code: AnalysisErrorCode,
    public readonly status: number,
    message: string,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  // The SDK reads ANTHROPIC_API_KEY from the server environment. The key never reaches the browser.
  // Defaults (140 s, one retry) stay within the route's 300 s limit; see config.ts for shorter hosts.
  const { timeoutMs, maxRetries } = getAiConfig();
  client ??= new Anthropic({ maxRetries, timeout: timeoutMs });
  return client;
}

export interface AnalysisPhoto {
  /** Base64-encoded image bytes. */
  data: string;
  mediaType: AllowedMediaType;
  role?: UploadRole;
}

export type AnalysisStage = "analyzing" | "reviewing";

export interface AnalyzeRockInput {
  /** One to three photos of the same specimen; the first is the main (overview) photo. */
  images: AnalysisPhoto[];
  context?: FieldContext;
  /** Language of the report's free text (enum values stay English). */
  lang?: Locale;
  signal?: AbortSignal;
  /** Called when the analysis moves to the next pass (used for progress in job mode). */
  onStage?: (stage: AnalysisStage) => void | Promise<void>;
  /**
   * Skip the review pass when the first pass took longer than this (ms). Used on hosts whose
   * request functions stop after a few minutes; background jobs leave it unset.
   */
  reviewBudgetMs?: number;
}

export interface AnalyzeRockOutput {
  analysis: RockAnalysis;
  model: string;
  /** True when the second (review) pass checked and corrected the report. */
  reviewed: boolean;
}

type ModelReply = { stop_reason: string | null; content: ReadonlyArray<{ type: string; text?: unknown }>; model: string };
type UserContent = Array<
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: AllowedMediaType; data: string }; cache_control?: { type: "ephemeral" } }
>;

/** One model call with the shared settings; returns the text reply. Throws `AnalysisError`. */
async function callModel(content: UserContent, signal: AbortSignal | undefined): Promise<{ text: string; model: string }> {
  const config = getAiConfig();
  let response: ModelReply;
  try {
    response = config.serverFallbacks
      ? await getClient().beta.messages.create(
          {
            model: config.model,
            max_tokens: 16000,
            thinking: { type: "adaptive" },
            output_config: { effort: config.effort },
            // Opt-in server-side fallback: if the model declines for policy reasons, the API
            // retries on Anthropic's recommended fallback model instead of failing outright.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: ANALYSIS_SYSTEM_PROMPT,
            messages: [{ role: "user", content }],
          },
          { signal },
        )
      : // Gateway-compatible path (e.g. Netlify AI Gateway): no beta headers.
        await getClient().messages.create(
          {
            model: config.model,
            max_tokens: 16000,
            thinking: { type: "adaptive" },
            output_config: { effort: config.effort },
            system: ANALYSIS_SYSTEM_PROMPT,
            messages: [{ role: "user", content }],
          },
          { signal },
        );
  } catch (error) {
    logAiError(error);
    const mapped = mapSdkError(error);
    if (error instanceof Anthropic.APIError) mapped.detail = `${error.status ?? ""} ${error.message}`.trim().slice(0, 500);
    throw mapped;
  }

  if (response.stop_reason === "refusal") {
    throw new AnalysisError(
      "AI_REFUSED",
      422,
      "The AI declined to analyze this image. Please try a different photo of the specimen.",
    );
  }
  if (response.stop_reason === "max_tokens") {
    throw new AnalysisError("AI_INVALID_RESPONSE", 502, "The AI response was incomplete. Please try again.");
  }
  const text = response.content
    .map((block) => (block.type === "text" && typeof block.text === "string" ? block.text : ""))
    .join("");
  return { text, model: response.model };
}

/**
 * Sends the photos to Claude and returns a validated, normalized report, in two passes:
 * 1. analysis: the model writes the full report;
 * 2. review: the model looks at the same photos again, checks the draft against a checklist and
 *    returns a corrected report. If the review fails for any reason the first report is used, so
 *    the extra pass can only improve a result, never lose one.
 * Throws `AnalysisError` with a user-presentable message on every failure path of the first pass:
 * the app never fabricates a result when the model is unavailable.
 */
export async function analyzeRock({ images, context, lang, signal, onStage, reviewBudgetMs }: AnalyzeRockInput): Promise<AnalyzeRockOutput> {
  const config = getAiConfig();
  if (!config.apiKeyConfigured) {
    throw new AnalysisError(
      "AI_NOT_CONFIGURED",
      503,
      "The AI analysis service is not configured on this server. No identification was generated.",
    );
  }
  if (images.length === 0) {
    throw new AnalysisError("INVALID_REQUEST", 400, "No image was received.");
  }

  // Each photo is introduced by a short label (its number and what it shows), so the model can
  // refer to them and knows which one is the close-up or the scale shot. The photo blocks are
  // identical in both passes and the last one carries a cache breakpoint, so the review pass
  // reads the system prompt and photos from the prompt cache instead of paying for them again.
  const photoBlocks: UserContent = images.flatMap((photo, i) => [
    { type: "text" as const, text: photoLabel(i, images.length, photo.role) },
    {
      type: "image" as const,
      source: { type: "base64" as const, media_type: photo.mediaType, data: photo.data },
      ...(i === images.length - 1 ? { cache_control: { type: "ephemeral" as const } } : {}),
    },
  ]);

  // The report is too large for grammar-constrained structured outputs, so it is requested as
  // JSON described in the system prompt and validated below (see lib/analysis/wire.ts).
  const firstStartedAt = Date.now();
  await onStage?.("analyzing");
  const first = await callModel([...photoBlocks, { type: "text", text: buildUserPrompt(context, lang, images.length) }], signal);
  const draft = parseWireReport(first.text);
  if (!draft.ok) {
    console.error(`[dr-rock] AI report rejected: ${draft.reason.slice(0, 500)}`);
    const error = new AnalysisError("AI_INVALID_RESPONSE", 502, "The AI returned a report in an unexpected format. Please try again.");
    error.detail = draft.reason.slice(0, 500);
    throw error;
  }

  let final = draft.value;
  let model = first.model;
  let reviewed = false;
  const withinBudget = reviewBudgetMs === undefined || Date.now() - firstStartedAt < reviewBudgetMs;
  if (config.review && withinBudget && !signal?.aborted) {
    try {
      await onStage?.("reviewing");
      const review = await callModel(
        [...photoBlocks, { type: "text", text: buildReviewPrompt(JSON.stringify(draft.value), context, lang, images.length) }],
        signal,
      );
      const checked = parseWireReport(review.text);
      if (checked.ok) {
        final = checked.value;
        model = review.model;
        reviewed = true;
      } else {
        console.error(`[dr-rock] review report rejected, keeping the first report: ${checked.reason.slice(0, 300)}`);
      }
    } catch (error) {
      if (signal?.aborted) throw error;
      console.error("[dr-rock] review pass failed, keeping the first report:", error instanceof Error ? error.message : error);
    }
  }

  return { analysis: normalizeAnalysis(fromWire(final)), model, reviewed };
}

/**
 * Runs an analysis and always resolves to an HTTP status and response body (never throws).
 * Shared by the API route (direct mode) and the Netlify background function (job mode).
 */
export async function runAnalysis(
  input: AnalyzeRockInput,
  requestId: string,
  startedAt = Date.now(),
): Promise<{ status: number; body: AnalyzeResponse }> {
  try {
    const { analysis, model, reviewed } = await analyzeRock(input);
    return {
      status: 200,
      body: {
        ok: true,
        analysis,
        meta: {
          requestId,
          model,
          analyzedAt: new Date().toISOString(),
          durationMs: Date.now() - startedAt,
          reviewed,
          // The automatic centre crop is extra detail of photo 1, not another photo.
          photoCount: input.images.filter((photo) => photo.role !== "detail").length,
        },
      },
    };
  } catch (error) {
    if (error instanceof AnalysisError) {
      const detail = getAiConfig().debugErrors ? error.detail : undefined;
      return {
        status: error.status,
        body: { ok: false, error: { code: error.code, message: error.message, retryAfterSeconds: error.retryAfterSeconds, detail } },
      };
    }
    console.error(`[dr-rock] ${requestId} unexpected error`, error);
    return {
      status: 500,
      body: { ok: false, error: { code: "UNKNOWN", message: "Something went wrong during the analysis. Please try again." } },
    };
  }
}

/** Server-side log of the upstream failure (status + API message; never the key or the image). */
function logAiError(error: unknown): void {
  if (error instanceof Anthropic.APIUserAbortError) return;
  if (error instanceof Anthropic.APIError) {
    console.error(`[dr-rock] AI request failed: ${error.status ?? "no status"} ${error.message.slice(0, 500)}`);
  } else if (error instanceof Error) {
    console.error(`[dr-rock] AI request failed: ${error.name}: ${error.message.slice(0, 500)}`);
  }
}

function mapSdkError(error: unknown): AnalysisError {
  if (error instanceof AnalysisError) return error;

  if (error instanceof Anthropic.APIUserAbortError) {
    return new AnalysisError("TIMEOUT", 499, "The analysis was cancelled.");
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return new AnalysisError("TIMEOUT", 504, "The AI service took too long to respond. Please try again.");
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new AnalysisError("AI_UNAVAILABLE", 502, "Could not reach the AI service. Please try again in a moment.");
  }
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    console.error("[dr-rock] AI credentials rejected:", error.message);
    return new AnalysisError(
      "AI_NOT_CONFIGURED",
      503,
      "The AI service rejected this server's credentials. No identification was generated.",
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    const retry = Number(error.headers?.get?.("retry-after"));
    return new AnalysisError(
      "AI_BUSY",
      503,
      "The AI service is busy right now. Please try again shortly.",
      Number.isFinite(retry) && retry > 0 ? retry : 30,
    );
  }
  if (error instanceof Anthropic.BadRequestError) {
    console.error("[dr-rock] AI request rejected:", error.message);
    return new AnalysisError(
      "AI_REQUEST_REJECTED",
      422,
      "The AI service could not process this image. Try another photo in JPG or PNG format.",
    );
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`[dr-rock] AI API error ${error.status}:`, error.message);
    return new AnalysisError("AI_UNAVAILABLE", 502, "The AI service is temporarily unavailable. Please try again.");
  }
  if (error instanceof Anthropic.AnthropicError) {
    // Raised by the structured-output parser when the JSON does not match the schema.
    console.error("[dr-rock] AI output parsing failed:", error.message);
    return new AnalysisError("AI_INVALID_RESPONSE", 502, "The AI returned a report in an unexpected format. Please try again.");
  }
  console.error("[dr-rock] Unexpected analysis error:", error);
  return new AnalysisError("UNKNOWN", 500, "Something went wrong during the analysis. Please try again.");
}
