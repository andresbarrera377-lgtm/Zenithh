export const LIBRARY_CATEGORIES = [
  "igneous",
  "sedimentary",
  "metamorphic",
  "marine-fossil",
  "terrestrial-fossil",
  "mineral",
  "period",
  "era",
] as const;
export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export type RockTexture =
  | "granular"
  | "porphyritic"
  | "glassy"
  | "vesicular"
  | "fine"
  | "flow-banded"
  | "layered"
  | "laminated"
  | "clastic"
  | "fossiliferous"
  | "chalky"
  | "coal"
  | "crystalline"
  | "veined"
  | "foliated"
  | "schistose"
  | "banded";

export type FossilForm =
  | "ammonite"
  | "trilobite"
  | "brachiopod"
  | "crinoid"
  | "shark-tooth"
  | "coral"
  | "belemnite"
  | "fern"
  | "petrified-wood"
  | "dinosaur-bone"
  | "amber"
  | "footprint";

export type CrystalHabit = "hex-prism" | "cube" | "rhombohedron" | "sheets" | "blocky" | "botryoidal" | "granular" | "bladed";

/** Parameters for the procedural illustration of each entry (see components/art). */
export type ArtSpec =
  | { kind: "rock"; texture: RockTexture; palette: [light: string, mid: string, dark: string, accent?: string] }
  | { kind: "fossil"; form: FossilForm; matrix: [light: string, dark: string]; fossil: [light: string, dark: string] }
  | { kind: "crystal"; habit: CrystalHabit; palette: [light: string, mid: string, dark: string] }
  | { kind: "time"; unitId: string };

export interface LibraryEntry {
  id: string;
  name: string;
  category: LibraryCategory;
  /** Scientific or alternative name. */
  aka?: string;
  /** One-line teaser for cards. */
  summary: string;
  description: string;
  formation: string;
  /** Antiquity: when it formed / lived / spans. */
  age: string;
  facts: string[];
  properties: Array<{ label: string; value: string }>;
  /** Extra search keywords. */
  tags: string[];
  art: ArtSpec;
  related?: string[];
}

export const CATEGORY_META: Record<LibraryCategory, { label: string; plural: string; group: string; description: string }> = {
  igneous: {
    label: "Igneous rock",
    plural: "Igneous rocks",
    group: "Rocks",
    description: "Born from fire: rocks that crystallised from molten magma or lava.",
  },
  sedimentary: {
    label: "Sedimentary rock",
    plural: "Sedimentary rocks",
    group: "Rocks",
    description: "Layered archives of Earth's surface, built from sediment, shells and minerals — home to almost all fossils.",
  },
  metamorphic: {
    label: "Metamorphic rock",
    plural: "Metamorphic rocks",
    group: "Rocks",
    description: "Rocks transformed by heat, pressure and fluids deep in the crust, without melting.",
  },
  "marine-fossil": {
    label: "Marine fossil",
    plural: "Marine fossils",
    group: "Fossils",
    description: "Remains and traces of ancient sea life, the most common fossils on Earth.",
  },
  "terrestrial-fossil": {
    label: "Terrestrial fossil",
    plural: "Terrestrial fossils",
    group: "Fossils",
    description: "Plants, animals and traces preserved from ancient land environments.",
  },
  mineral: {
    label: "Mineral",
    plural: "Minerals",
    group: "Minerals",
    description: "The crystalline building blocks that make up every rock.",
  },
  period: {
    label: "Geological period",
    plural: "Geological periods",
    group: "Deep time",
    description: "The chapters of the Phanerozoic — the last 539 million years of complex life.",
  },
  era: {
    label: "Geological era",
    plural: "Geological eras",
    group: "Deep time",
    description: "The great divisions of Earth history, separated by mass extinctions.",
  },
};
