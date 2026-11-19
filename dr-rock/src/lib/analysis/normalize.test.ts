import { describe, expect, it } from "vitest";
import { EXAMPLE_ANALYSIS } from "./example";
import { normalizeAnalysis, PROBABLE_FOSSIL_MIN_CONFIDENCE } from "./normalize";
import { RockAnalysisSchema, type RockAnalysis } from "./schema";

function variant(mutate: (a: RockAnalysis) => void): RockAnalysis {
  const copy = structuredClone(EXAMPLE_ANALYSIS);
  mutate(copy);
  return copy;
}

describe("normalizeAnalysis", () => {
  it("keeps a consistent report intact", () => {
    const out = normalizeAnalysis(EXAMPLE_ANALYSIS);
    expect(out.verdict).toBe("probable_fossil");
    expect(out.paleontology.hasFossilIndications).toBe(true);
    expect(RockAnalysisSchema.safeParse(out).success).toBe(true);
  });

  it("never reports a human-made object as a probable fossil", () => {
    const out = normalizeAnalysis(
      variant((a) => {
        a.origin = { verdict: "human_made", confidence: 140, likelyObject: "Resin replica of a trilobite", imitates: "trilobite fossil", evidence: ["Mould seam", " "] };
      }),
    );
    expect(out.verdict).toBe("inconclusive_fossil_like");
    expect(out.identification.classification).toBe("artificial");
    expect(out.origin).toMatchObject({ confidence: 100, evidence: ["Mould seam"] });
  });

  it("accepts reports saved before the origin section existed", () => {
    const legacy = variant((a) => delete a.origin);
    const out = normalizeAnalysis(legacy);
    expect(out.origin).toBeUndefined();
    expect(RockAnalysisSchema.safeParse(out).success).toBe(true);
  });

  it("forces 'insufficient_image' when the photo shows no rock", () => {
    const out = normalizeAnalysis(variant((a) => (a.imageAssessment.showsRockOrFossil = false)));
    expect(out.verdict).toBe("insufficient_image");
    expect(out.paleontology.hasFossilIndications).toBe(false);
    expect(out.identification.fossilType).toBeNull();
    expect(out.ageAndHistory.fossilAge).toBeNull();
    expect(out.confidence.identification).toBeLessThanOrEqual(40);
  });

  it("downgrades an over-confident fossil claim", () => {
    const out = normalizeAnalysis(variant((a) => (a.confidence.fossil = PROBABLE_FOSSIL_MIN_CONFIDENCE - 1)));
    expect(out.verdict).toBe("inconclusive_fossil_like");
    expect(out.paleontology.hasFossilIndications).toBe(true);
  });

  it("clamps numbers and orders ranges", () => {
    const out = normalizeAnalysis(
      variant((a) => {
        a.confidence.identification = 140.6;
        a.confidence.fossil = -3;
        a.composition.mohsHardness = { min: 12, max: 0.2, note: "" };
        a.ageAndHistory.rockAge.minMa = 500;
        a.ageAndHistory.rockAge.maxMa = 300;
        a.verdict = "no_visible_fossil";
      }),
    );
    expect(out.confidence.identification).toBe(100);
    expect(out.confidence.fossil).toBe(0);
    expect(out.composition.mohsHardness).toMatchObject({ min: 1, max: 10 });
    expect(out.ageAndHistory.rockAge).toMatchObject({ minMa: 300, maxMa: 500 });
  });

  it("limits did-you-know facts to five", () => {
    const out = normalizeAnalysis(variant((a) => (a.didYouKnow = ["1", "2", "3", "4", "5", "6", " "])));
    expect(out.didYouKnow).toHaveLength(5);
  });
});
