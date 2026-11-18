import "server-only";

/**
 * AI configuration, read from server-side environment variables only.
 * Nothing in this module may be imported by client components.
 */

const EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;
export type Effort = (typeof EFFORTS)[number];

export const DEFAULT_MODEL = "claude-opus-5-5";

export function getAiConfig() {
  const effortEnv = process.env.DR_ROCK_EFFORT as Effort | undefined;
  return {
    apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    model: process.env.DR_ROCK_MODEL?.trim() || DEFAULT_MODEL,
    effort: effortEnv && EFFORTS.includes(effortEnv) ? effortEnv : ("high" as Effort),
    // Per-attempt AI timeout and retries. Defaults suit hosts with long function limits (Vercel: 300 s).
    // On hosts with shorter limits (Netlify: 60 s) lower these so a slow analysis ends in a clear
    // TIMEOUT error instead of the platform killing the function mid-request.
    timeoutMs: intInRange(process.env.DR_ROCK_TIMEOUT_SECONDS, 140, 10, 280) * 1000,
    maxRetries: intInRange(process.env.DR_ROCK_MAX_RETRIES, 1, 0, 3),
    // Server-side refusal fallback needs an `anthropic-beta` header. AI gateways that don't forward
    // beta headers (e.g. Netlify AI Gateway) reject it, so it can be turned off with "off".
    serverFallbacks: process.env.DR_ROCK_SERVER_FALLBACKS?.trim().toLowerCase() !== "off",
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
