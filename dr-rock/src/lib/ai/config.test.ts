import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_MODEL, getAiConfig } from "./config";

afterEach(() => vi.unstubAllEnvs());

describe("getAiConfig", () => {
  it("uses defaults sized for long function limits", () => {
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "");
    vi.stubEnv("DR_ROCK_EFFORT", "");
    vi.stubEnv("DR_ROCK_MODEL", "");
    const config = getAiConfig();
    expect(config).toMatchObject({ model: DEFAULT_MODEL, effort: "high", timeoutMs: 240_000, maxRetries: 1, review: true });
  });

  it("accepts a short-host profile (Netlify: 60 s functions)", () => {
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "50");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "0");
    vi.stubEnv("DR_ROCK_EFFORT", "medium");
    const config = getAiConfig();
    expect(config).toMatchObject({ effort: "medium", timeoutMs: 50_000, maxRetries: 0 });
  });

  it("uses Vercel AI Gateway automatically on Vercel without an API key", () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("DR_ROCK_MODEL", "");
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "");
    expect(getAiConfig()).toMatchObject({
      gateway: "vercel",
      apiKeyConfigured: true,
      model: "anthropic/claude-opus-5.5",
      serverFallbacks: false,
      timeoutMs: 150_000,
      maxRetries: 0,
    });
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    expect(getAiConfig()).toMatchObject({ gateway: "anthropic", model: "claude-opus-5-5" });
  });

  it("turns the review pass off only when asked", () => {
    vi.stubEnv("DR_ROCK_REVIEW", "off");
    expect(getAiConfig().review).toBe(false);
    vi.stubEnv("DR_ROCK_REVIEW", "on");
    expect(getAiConfig().review).toBe(true);
  });

  it("clamps out-of-range values and ignores junk", () => {
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "9999");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "-4");
    vi.stubEnv("DR_ROCK_EFFORT", "turbo");
    const config = getAiConfig();
    expect(config).toMatchObject({ timeoutMs: 600_000, maxRetries: 0, effort: "high" });
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "abc");
    expect(getAiConfig().timeoutMs).toBe(240_000);
  });
});
