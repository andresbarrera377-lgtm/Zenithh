import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { normalizeAnalysis } from "@/lib/analysis/normalize";
import type { AnalysisErrorCode, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import { RockAnalysisWireSchema, fromWire, type RockAnalysisWire } from "@/lib/analysis/wire";
import type { AllowedMediaType } from "@/lib/server/image-validation";
import { getAiConfig } from "./config";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

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

export interface AnalyzeRockInput {
  imageBase64: string;
  mediaType: AllowedMediaType;
  context?: FieldContext;
  signal?: AbortSignal;
}

export interface AnalyzeRockOutput {
  analysis: RockAnalysis;
  model: string;
}

/**
 * Sends the photo to Claude and returns a validated, normalized report.
 * Throws `AnalysisError` with a user-presentable message on every failure path:
 * the app never fabricates a result when the model is unavailable.
 */
export async function analyzeRock({ imageBase64, mediaType, context, signal }: AnalyzeRockInput): Promise<AnalyzeRockOutput> {
  const config = getAiConfig();
  if (!config.apiKeyConfigured) {
    throw new AnalysisError(
      "AI_NOT_CONFIGURED",
      503,
      "The AI analysis service is not configured on this server. No identification was generated.",
    );
  }

  const userContent = [
    { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: imageBase64 } },
    { type: "text" as const, text: buildUserPrompt(context) },
  ];

  let response: { stop_reason: string | null; parsed_output: RockAnalysisWire | null | undefined; model: string };
  try {
    response = config.serverFallbacks
      ? await getClient().beta.messages.parse(
          {
            model: config.model,
            max_tokens: 16000,
            thinking: { type: "adaptive" },
            output_config: { effort: config.effort, format: betaZodOutputFormat(RockAnalysisWireSchema) },
            // Opt-in server-side fallback: if the model declines for policy reasons, the API
            // retries on Anthropic's recommended fallback model instead of failing outright.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userContent }],
          },
          { signal },
        )
      : // Gateway-compatible path: GA structured outputs, no beta headers.
        await getClient().messages.parse(
          {
            model: config.model,
            max_tokens: 16000,
            thinking: { type: "adaptive" },
            output_config: { effort: config.effort, format: zodOutputFormat(RockAnalysisWireSchema) },
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userContent }],
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
  if (!response.parsed_output) {
    throw new AnalysisError("AI_INVALID_RESPONSE", 502, "The AI returned a report in an unexpected format. Please try again.");
  }

  return { analysis: normalizeAnalysis(fromWire(response.parsed_output)), model: response.model };
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
