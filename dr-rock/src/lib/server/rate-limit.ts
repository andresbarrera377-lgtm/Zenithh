/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * It protects the AI budget from accidental floods and casual abuse. State lives in the
 * memory of a single server instance, so on multi-instance / serverless deployments it is
 * best-effort; swap `createRateLimiter` for a shared store (Redis, Upstash, a database)
 * when stricter guarantees are needed — the call site does not need to change.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
}

export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, number[]>();
  let lastSweep = 0;

  function sweep(now: number) {
    if (now - lastSweep < windowMs) return;
    lastSweep = now;
    for (const [key, times] of hits) {
      const recent = times.filter((t) => now - t < windowMs);
      if (recent.length === 0) hits.delete(key);
      else hits.set(key, recent);
    }
  }

  return {
    check(key, now = Date.now()) {
      sweep(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        const retryAfterMs = windowMs - (now - recent[0]);
        hits.set(key, recent);
        return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
      }
      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, remaining: max - recent.length, retryAfterSeconds: 0 };
    },
  };
}

/** Best-effort client identifier from proxy headers. */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "anonymous";
}
