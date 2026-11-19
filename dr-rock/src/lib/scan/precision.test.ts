import { describe, expect, it } from "vitest";
import type { PhotoQuality } from "@/lib/image/quality";
import { assessPrecision, countTests } from "./precision";

const good: PhotoQuality = { score: "good", warnings: [], sharpness: 500, brightness: 120, contrast: 40 };
const poor: PhotoQuality = { score: "poor", warnings: ["blurry"], sharpness: 5, brightness: 120, contrast: 40 };

describe("assessPrecision", () => {
  it("rates a single photo as basic and suggests a close-up and tests", () => {
    const r = assessPrecision({ photos: [{ role: "overview", quality: good }], context: {} });
    expect(r.level).toBe("basic");
    expect(r.tips).toEqual(["closeup", "tests"]);
  });

  it("rates photos plus tests as great", () => {
    const r = assessPrecision({
      photos: [
        { role: "overview", quality: good },
        { role: "closeup", quality: good },
        { role: "other", quality: good },
      ],
      context: { location: "Beach", tests: { fizz: "none", hardness: "hard" } },
    });
    expect(r.level).toBe("great");
    expect(r.tips).toEqual([]);
  });

  it("penalises poor photos and asks to retake them first", () => {
    const r = assessPrecision({
      photos: [
        { role: "overview", quality: poor },
        { role: "closeup", quality: good },
      ],
      context: {},
    });
    expect(r.tips[0]).toBe("quality");
    expect(r.level).toBe("basic");
  });

  it("counts only answered tests", () => {
    expect(countTests({ tests: { streak: "  ", magnet: "none" } })).toBe(1);
  });
});
