import { describe, expect, it } from "vitest";
import { clientKeyFromHeaders, createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows up to max requests per window, then blocks with a retry hint", () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 60_000 });
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 1000).allowed).toBe(true);
    const blocked = limiter.check("a", 2000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(58);
    expect(limiter.check("b", 2000).allowed).toBe(true);
    expect(limiter.check("a", 61_000).allowed).toBe(true);
  });
});

describe("clientKeyFromHeaders", () => {
  it("uses the first forwarded address", () => {
    expect(clientKeyFromHeaders(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }))).toBe("1.2.3.4");
    expect(clientKeyFromHeaders(new Headers())).toBe("anonymous");
  });
});
