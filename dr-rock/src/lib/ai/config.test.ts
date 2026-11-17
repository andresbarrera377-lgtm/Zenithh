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
    expect(config).toMatchObject({ model: DEFAULT_MODEL, effort: "high", timeoutMs: 140_000, maxRetries: 1 });
  });

  it("accepts a short-host profile (Netlify: 60 s functions)", () => {
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "50");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "0");
    vi.stubEnv("DR_ROCK_EFFORT", "medium");
    const config = getAiConfig();
    expect(config).toMatchObject({ effort: "medium", timeoutMs: 50_000, maxRetries: 0 });
  });

  it("clamps out-of-range values and ignores junk", () => {
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "9999");
    vi.stubEnv("DR_ROCK_MAX_RETRIES", "-4");
    vi.stubEnv("DR_ROCK_EFFORT", "turbo");
    const config = getAiConfig();
    expect(config).toMatchObject({ timeoutMs: 280_000, maxRetries: 0, effort: "high" });
    vi.stubEnv("DR_ROCK_TIMEOUT_SECONDS", "abc");
    expect(getAiConfig().timeoutMs).toBe(140_000);
  });
});
