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
    rateLimitMax: positiveInt(process.env.RATE_LIMIT_MAX, 12),
    rateLimitWindowSeconds: positiveInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 600),
  };
}

function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
