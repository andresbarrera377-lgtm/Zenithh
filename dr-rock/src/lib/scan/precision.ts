import type { PhotoRole } from "@/lib/analysis/photos";
import type { FieldContext } from "@/lib/analysis/schema";
import type { PhotoQuality } from "@/lib/image/quality";

export type PrecisionLevel = "basic" | "good" | "great";
export type PrecisionTip = "closeup" | "other" | "tests" | "quality" | "location";

export interface PrecisionInput {
  photos: Array<{ role: PhotoRole; quality: PhotoQuality }>;
  context: FieldContext;
}

/** Number of field tests the user answered (the streak only counts when written). */
export function countTests(context: FieldContext): number {
  const t = context.tests ?? {};
  return [t.fizz, t.hardness, t.magnet, t.heft, t.streak?.trim()].filter(Boolean).length;
}

/**
 * How much evidence the analysis will get, shown as a meter on the Scan screen with the next
 * most useful thing to add. A close-up and simple tests matter most; poor photos count against.
 * Scores: overview 2, close-up 2, other view 1, up to 2 tests 1 each, location or size 1;
 * minus 1 per poor photo. Basic < 4 ≤ good < 6.5 ≤ great (max 8).
 */
export function assessPrecision({ photos, context }: PrecisionInput): { level: PrecisionLevel; score: number; tips: PrecisionTip[] } {
  const has = (role: PhotoRole) => photos.some((p) => p.role === role);
  const poor = photos.filter((p) => p.quality.score === "poor").length;
  const tests = countTests(context);
  const located = Boolean(context.location?.trim() || context.size?.trim());

  let score = 0;
  if (has("overview")) score += 2;
  if (has("closeup")) score += 2;
  if (has("other")) score += 1;
  score += Math.min(2, tests);
  if (located) score += 1;
  score -= poor;

  const tips: PrecisionTip[] = [];
  if (poor > 0) tips.push("quality");
  if (!has("closeup")) tips.push("closeup");
  if (tests === 0) tips.push("tests");
  if (!has("other")) tips.push("other");
  if (!located) tips.push("location");

  const level: PrecisionLevel = score >= 6.5 ? "great" : score >= 4 ? "good" : "basic";
  return { level, score, tips: tips.slice(0, 2) };
}
