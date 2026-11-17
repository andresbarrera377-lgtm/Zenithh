import type { Tone } from "@/components/ui/primitives";
import type { Classification, Verdict } from "./schema";

/** Display metadata for each verdict. Shared by results, collection and landing previews. */
export const VERDICT_META: Record<
  Verdict,
  { label: string; short: string; tone: Tone; description: string }
> = {
  probable_fossil: {
    label: "Probable fossil",
    short: "Probable fossil",
    tone: "mineral",
    description: "Diagnostic organic features are visible. Still an estimate until examined by a specialist.",
  },
  inconclusive_fossil_like: {
    label: "Fossil-like, not conclusive",
    short: "Inconclusive",
    tone: "ochre",
    description: "Something resembles an organic structure, but the photo does not show diagnostic detail.",
  },
  no_visible_fossil: {
    label: "No visible fossil evidence",
    short: "No fossil seen",
    tone: "azurite",
    description: "The rock can be identified and no organic structures are visible on this surface.",
  },
  insufficient_image: {
    label: "Image insufficient",
    short: "Insufficient image",
    tone: "jasper",
    description: "The photo does not allow a responsible conclusion. Try a sharper, closer, well-lit photo.",
  },
};

export const CLASSIFICATION_META: Record<Classification, { label: string; description: string }> = {
  igneous: { label: "Igneous", description: "Formed by cooling and solidification of magma or lava." },
  sedimentary: {
    label: "Sedimentary",
    description: "Formed from deposited and cemented sediments, minerals or organic remains.",
  },
  metamorphic: {
    label: "Metamorphic",
    description: "Transformed by heat, pressure or fluids without melting.",
  },
  mineral: { label: "Mineral", description: "A single naturally occurring crystalline substance." },
  unknown: { label: "Undetermined", description: "The rock family could not be determined from this photo." },
};

export function confidenceLevel(value: number): { label: string; tone: Tone } {
  if (value >= 70) return { label: "High", tone: "mineral" };
  if (value >= 40) return { label: "Moderate", tone: "ochre" };
  return { label: "Low", tone: "jasper" };
}
