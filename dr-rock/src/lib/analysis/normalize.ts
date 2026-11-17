import { clamp } from "@/lib/utils";
import type { AgeEstimate, RockAnalysis } from "./schema";

/** Minimum fossil confidence for a "probable_fossil" verdict to stand. */
export const PROBABLE_FOSSIL_MIN_CONFIDENCE = 55;

/** Earth is ~4,567 million years old. */
const EARTH_AGE_MA = 4567;

function normalizeAge(age: AgeEstimate): AgeEstimate {
  let minMa = age.minMa == null ? null : clamp(age.minMa, 0, EARTH_AGE_MA);
  let maxMa = age.maxMa == null ? null : clamp(age.maxMa, 0, EARTH_AGE_MA);
  if (minMa != null && maxMa != null && minMa > maxMa) [minMa, maxMa] = [maxMa, minMa];
  return { ...age, minMa, maxMa, periods: age.periods.slice(0, 6) };
}

function normalizeHardness(value: number | null): number | null {
  if (value == null) return null;
  return Math.round(clamp(value, 1, 10) * 10) / 10;
}

/**
 * Applies the scientific-safety rules that must hold regardless of what the model returned:
 *
 * 1. A photo that does not show a rock, or is unusable, can only produce "insufficient_image".
 * 2. "probable_fossil" requires a minimum fossil confidence; otherwise it is downgraded to
 *    "inconclusive_fossil_like" so the app never overstates a fossil claim.
 * 3. Fossil fields are only kept when the verdict actually indicates something fossil-like.
 * 4. Numbers are clamped to valid ranges and lists are trimmed to what the UI expects.
 */
export function normalizeAnalysis(input: RockAnalysis): RockAnalysis {
  const a: RockAnalysis = structuredClone(input);

  a.confidence.identification = Math.round(clamp(a.confidence.identification, 0, 100));
  a.confidence.fossil = Math.round(clamp(a.confidence.fossil, 0, 100));

  const unusable = !a.imageAssessment.showsRockOrFossil || a.imageAssessment.quality === "unusable";
  if (unusable) {
    a.verdict = "insufficient_image";
  }

  if (a.verdict === "probable_fossil" && a.confidence.fossil < PROBABLE_FOSSIL_MIN_CONFIDENCE) {
    a.verdict = "inconclusive_fossil_like";
  }

  if (a.verdict === "insufficient_image") {
    a.confidence.identification = Math.min(a.confidence.identification, 40);
  }

  const fossilLike = a.verdict === "probable_fossil" || a.verdict === "inconclusive_fossil_like";
  a.paleontology.hasFossilIndications = fossilLike;
  if (!fossilLike) {
    a.identification.fossilType = null;
    a.ageAndHistory.fossilAge = null;
  }

  a.ageAndHistory.rockAge = normalizeAge(a.ageAndHistory.rockAge);
  if (a.ageAndHistory.fossilAge) a.ageAndHistory.fossilAge = normalizeAge(a.ageAndHistory.fossilAge);

  let hMin = normalizeHardness(a.composition.mohsHardness.min);
  let hMax = normalizeHardness(a.composition.mohsHardness.max);
  if (hMin != null && hMax != null && hMin > hMax) [hMin, hMax] = [hMax, hMin];
  a.composition.mohsHardness.min = hMin;
  a.composition.mohsHardness.max = hMax;

  a.didYouKnow = a.didYouKnow.filter((f) => f.trim().length > 0).slice(0, 5);
  a.identification.alternatives = a.identification.alternatives.slice(0, 3);
  a.identification.keyFeatures = a.identification.keyFeatures.slice(0, 6);
  a.imageAssessment.photoTips = a.imageAssessment.photoTips.slice(0, 4);
  a.verificationSteps = a.verificationSteps.slice(0, 5);
  a.geologicalSetting.worldRegions = a.geologicalSetting.worldRegions.slice(0, 6);

  return a;
}
