import type { Tone } from "@/components/ui/primitives";
import type { Verdict } from "./schema";

/**
 * Display colours for each verdict. Labels and descriptions are translated in
 * lib/i18n/messages/report.ts (verdicts, classifications, levels).
 */
export const VERDICT_TONE: Record<Verdict, Tone> = {
  probable_fossil: "mineral",
  inconclusive_fossil_like: "ochre",
  no_visible_fossil: "azurite",
  insufficient_image: "jasper",
};

export type ConfidenceLevelKey = "high" | "moderate" | "low";

export function confidenceLevel(value: number): { key: ConfidenceLevelKey; tone: Tone } {
  if (value >= 70) return { key: "high", tone: "mineral" };
  if (value >= 40) return { key: "moderate", tone: "ochre" };
  return { key: "low", tone: "jasper" };
}
