import type { RockAnalysis } from "./schema";

/**
 * Hand-written ILLUSTRATIVE report used only on the marketing landing page to preview the
 * results interface. It is always displayed with an "Illustrative example" label and is
 * never returned by the analysis API.
 */
export const EXAMPLE_ANALYSIS: RockAnalysis = {
  imageAssessment: {
    quality: "good",
    showsRockOrFossil: true,
    subjectDescription: "A pale grey rock fragment with several ribbed, fan-shaped shells exposed on its surface.",
    issues: ["No scale reference in the frame"],
    photoTips: ["Add a coin or ruler for scale", "Photograph the opposite face as well"],
  },
  verdict: "probable_fossil",
  verdictSummary:
    "Several fan-shaped shells with radiating ribs and growth lines are visible — features typical of brachiopods preserved in limestone.",
  confidence: {
    identification: 78,
    fossil: 74,
    rationale:
      "Ribbed valves with a hinge line and concentric growth lines are diagnostic; confidence is limited by the lack of a scale and a view of the hinge interior.",
  },
  identification: {
    rockName: "Fossiliferous limestone",
    rockType: "Bioclastic carbonate sedimentary rock",
    classification: "sedimentary",
    alternatives: [{ name: "Shelly sandstone", reason: "Possible if the matrix is sandy rather than carbonate; an acid test would distinguish them." }],
    fossilType: "Brachiopod shells",
    keyFeatures: [
      { feature: "Shell shape", observation: "Fan-shaped valves with radiating ribs", interpretation: "Typical of brachiopods" },
      { feature: "Matrix", observation: "Fine-grained, pale grey, carbonate-looking", interpretation: "Lime mud deposited in a shallow sea" },
    ],
  },
  observations: {
    texture: "Fine-grained matrix with embedded shell fragments",
    color: "Pale grey to cream",
    shape: "Irregular, broken fragment",
    patterns: "Radiating ribs and concentric growth lines on the shells",
    structures: "Shells concentrated on one bedding surface",
    organicImpressions: "Several brachiopod valves and small crinoid columnals",
    mineralFormations: "None visible",
    sedimentaryFeatures: "Faint bedding parallel to the shell layer",
  },
  ageAndHistory: {
    rockAge: {
      summary: "Most likely Paleozoic, when brachiopod-rich limestones were widespread",
      periods: ["Ordovician", "Silurian", "Devonian", "Carboniferous"],
      era: "Paleozoic",
      minMa: 299,
      maxMa: 485,
      basis: "Brachiopod-dominated shell beds are characteristic of Paleozoic seas; a photo cannot date the rock precisely.",
    },
    fossilAge: {
      summary: "Brachiopods have lived from the Cambrian to the present",
      periods: ["Cambrian – present"],
      era: null,
      minMa: 0,
      maxMa: 525,
      basis: "Age range of the group as a whole.",
    },
    formationStory:
      "Shells of brachiopods living on a warm, shallow seafloor accumulated in lime mud. Burial and cementation turned the mud into limestone, preserving the shells.",
    relatedEvents: ["Great Ordovician Biodiversification Event", "End-Permian mass extinction"],
  },
  geologicalSetting: {
    environments: ["Shallow marine shelf", "Carbonate platform"],
    strata: "Bedded limestones interlayered with shales",
    depth: "Formed at the seafloor; now found at the surface after uplift and erosion",
    favorableConditions: "Warm, clear, shallow water with abundant shell-building life",
    worldRegions: ["Ohio Valley, USA", "Welsh Borderland, UK", "Gotland, Sweden"],
    earthLayers: "Formed and preserved in the upper continental crust.",
  },
  composition: {
    minerals: [{ name: "Calcite", role: "Major" }],
    chemistry: "Calcium carbonate (CaCO₃)",
    mohsHardness: { min: 3, max: 3, note: "Typical of calcite" },
    porosity: "Low to moderate",
    density: { value: "2.5–2.7 g/cm³", note: "Typical limestone" },
    physicalProperties: "Fizzes in dilute acid; weathers by dissolution.",
  },
  didYouKnow: [
    "Brachiopods look like clams but belong to a different branch of animal life.",
    "Hundreds of brachiopod species still live today.",
    "Their name means 'arm-foot'.",
  ],
  paleontology: {
    hasFossilIndications: true,
    organism: "Brachiopods",
    biologicalGroup: "Brachiopoda",
    periodLived: "Cambrian – present (dominant in the Paleozoic)",
    habitat: "Shallow seafloor",
    preservation: "Original calcite shells",
    scientificImportance: "Brachiopod assemblages help date and reconstruct Paleozoic environments.",
    noFossilExplanation: null,
  },
  verificationSteps: ["Apply a drop of dilute acid or vinegar to the matrix", "Examine the hinge with a hand lens"],
};
