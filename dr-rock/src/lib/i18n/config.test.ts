import { describe, expect, it } from "vitest";
import { pickLocale } from "./config";

describe("pickLocale", () => {
  it("prefers the saved choice", () => {
    expect(pickLocale("en", "es-ES,es;q=0.9")).toBe("en");
    expect(pickLocale("es", "en-US")).toBe("es");
  });
  it("falls back to the browser language, then Spanish", () => {
    expect(pickLocale(undefined, "en-US,en;q=0.9,es;q=0.8")).toBe("en");
    expect(pickLocale(undefined, "fr-FR,fr;q=0.9,en;q=0.8")).toBe("en");
    expect(pickLocale(undefined, "es-MX,es;q=0.9")).toBe("es");
    expect(pickLocale(undefined, "de-DE")).toBe("es");
    expect(pickLocale(undefined, null)).toBe("es");
    expect(pickLocale("xx", "es;q=0.2, en;q=0.9")).toBe("en");
  });
});
