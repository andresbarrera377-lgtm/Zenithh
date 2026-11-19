/**
 * AI configuration, read from server-side environment variables only.
 * App code imports it through the `server-only` wrapper `config.ts`; the Netlify background
 * function imports this file directly.
 */

const EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;
export type Effort = (typeof EFFORTS)[number];

export const DEFAULT_MODEL = "claude-opus-5-5";

/** Vercel AI Gateway's Anthropic-compatible endpoint (authenticated with the project's OIDC token). */
export const VERCEL_AI_GATEWAY_URL = "https://ai-gateway.vercel.sh";

export function getAiConfig() {
  const effortEnv = process.env.DR_ROCK_EFFORT as Effort | undefined;
  // "vercel": call Claude through Vercel AI Gateway with the deployment's own OIDC token (no API
  // key needed on Vercel). Anything else uses ANTHROPIC_API_KEY / ANTHROPIC_BASE_URL as usual.
  const gateway = process.env.DR_ROCK_AI_GATEWAY?.trim().toLowerCase() === "vercel" ? ("vercel" as const) : ("anthropic" as const);
  return {
    gateway,
    apiKeyConfigured: gateway === "vercel" || Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    model: process.env.DR_ROCK_MODEL?.trim() || DEFAULT_MODEL,
    effort: effortEnv && EFFORTS.includes(effortEnv) ? effortEnv : ("high" as Effort),
    // Per-attempt AI timeout and retries. Defaults suit hosts with long function limits (Vercel: 300 s).
    // On hosts with shorter limits (Netlify: 60 s) lower these so a slow analysis ends in a clear
    // TIMEOUT error instead of the platform killing the function mid-request.
    // Up to 600 s per attempt for background jobs (Netlify background functions run 15 min).
    timeoutMs: intInRange(process.env.DR_ROCK_TIMEOUT_SECONDS, 240, 10, 600) * 1000,
    maxRetries: intInRange(process.env.DR_ROCK_MAX_RETRIES, 1, 0, 3),
    // Server-side refusal fallback needs an `anthropic-beta` header. AI gateways that don't forward
    // beta headers (e.g. Netlify AI Gateway) reject it, so it can be turned off with "off".
    serverFallbacks: process.env.DR_ROCK_SERVER_FALLBACKS?.trim().toLowerCase() !== "off",
    // "netlify-background": run each analysis as a Netlify background job (Blobs + polling) because
    // Netlify request functions stop at ~30 s. Anything else analyzes within the request.
    jobMode: process.env.DR_ROCK_JOB_MODE?.trim().toLowerCase() === "netlify-background" ? ("netlify-background" as const) : ("direct" as const),
    // Second pass in which the model re-examines the photos and corrects its own draft report.
    // More accurate, roughly twice the time and cost; "off" disables it.
    review: process.env.DR_ROCK_REVIEW?.trim().toLowerCase() !== "off",
    // Diagnostics only: include the upstream API error message in error responses.
    debugErrors: process.env.DR_ROCK_DEBUG_ERRORS?.trim().toLowerCase() === "on",
    rateLimitMax: positiveInt(process.env.RATE_LIMIT_MAX, 12),
    rateLimitWindowSeconds: positiveInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 600),
  };
}

function intInRange(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
