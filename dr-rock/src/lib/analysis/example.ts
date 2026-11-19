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
  origin: {
    verdict: "natural",
    confidence: 90,
    likelyObject: null,
    imitates: null,
    evidence: [
      "Irregular broken edges with no sawn faces, drill holes or polish (photo 1)",
      "Shells are embedded in the matrix at different angles and partly weathered out, as in natural shell beds",
    ],
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

/** The same illustrative report in Spanish (enum values stay in English, as in real reports). */
export const EXAMPLE_ANALYSIS_ES: RockAnalysis = {
  ...EXAMPLE_ANALYSIS,
  imageAssessment: {
    ...EXAMPLE_ANALYSIS.imageAssessment,
    subjectDescription: "Un fragmento de roca gris claro con varias conchas acanaladas en forma de abanico expuestas en la superficie.",
    issues: ["No hay ninguna referencia de escala en la foto"],
    photoTips: ["Añade una moneda o una regla como escala", "Fotografía también la cara opuesta"],
  },
  origin: {
    verdict: "natural",
    confidence: 90,
    likelyObject: null,
    imitates: null,
    evidence: [
      "Bordes rotos e irregulares, sin caras serradas, perforaciones ni pulido (foto 1)",
      "Las conchas están incrustadas en la matriz con distintos ángulos y en parte desgastadas, como en los bancos de conchas naturales",
    ],
  },
  verdictSummary:
    "Se ven varias conchas en forma de abanico con costillas radiales y líneas de crecimiento, rasgos típicos de braquiópodos conservados en caliza.",
  confidence: {
    ...EXAMPLE_ANALYSIS.confidence,
    rationale:
      "Las valvas acanaladas con línea de charnela y líneas de crecimiento concéntricas son diagnósticas; la confianza está limitada por la falta de escala y de una vista del interior de la charnela.",
  },
  identification: {
    ...EXAMPLE_ANALYSIS.identification,
    rockName: "Caliza fosilífera",
    rockType: "Roca sedimentaria carbonatada bioclástica",
    alternatives: [{ name: "Arenisca con conchas", reason: "Posible si la matriz es arenosa y no carbonatada; la prueba del ácido las distingue." }],
    fossilType: "Conchas de braquiópodos",
    keyFeatures: [
      { feature: "Forma de las conchas", observation: "Valvas en abanico con costillas radiales", interpretation: "Típico de braquiópodos" },
      { feature: "Matriz", observation: "Grano fino, gris claro, de aspecto carbonatado", interpretation: "Barro calcáreo depositado en un mar poco profundo" },
    ],
  },
  observations: {
    texture: "Matriz de grano fino con fragmentos de concha incrustados",
    color: "De gris claro a crema",
    shape: "Fragmento irregular y roto",
    patterns: "Costillas radiales y líneas de crecimiento concéntricas en las conchas",
    structures: "Conchas concentradas en una superficie de estratificación",
    organicImpressions: "Varias valvas de braquiópodos y pequeños columnales de crinoideos",
    mineralFormations: "No se ven",
    sedimentaryFeatures: "Estratificación tenue paralela a la capa de conchas",
  },
  ageAndHistory: {
    rockAge: {
      ...EXAMPLE_ANALYSIS.ageAndHistory.rockAge,
      summary: "Lo más probable es que sea paleozoica, cuando abundaban las calizas ricas en braquiópodos",
      periods: ["Ordovícico", "Silúrico", "Devónico", "Carbonífero"],
      era: "Paleozoico",
      basis: "Los bancos de conchas dominados por braquiópodos son característicos de los mares paleozoicos; una foto no permite datar la roca con precisión.",
    },
    fossilAge: {
      ...EXAMPLE_ANALYSIS.ageAndHistory.fossilAge!,
      summary: "Los braquiópodos viven desde el Cámbrico hasta hoy",
      periods: ["Cámbrico – actualidad"],
      basis: "Rango de edad del grupo en su conjunto.",
    },
    formationStory:
      "Las conchas de braquiópodos que vivían en un fondo marino cálido y poco profundo se acumularon en barro calcáreo. El enterramiento y la cementación convirtieron el barro en caliza y conservaron las conchas.",
    relatedEvents: ["Gran Evento de Biodiversificación del Ordovícico", "Extinción masiva del final del Pérmico"],
  },
  geologicalSetting: {
    environments: ["Plataforma marina somera", "Plataforma carbonatada"],
    strata: "Calizas estratificadas intercaladas con lutitas",
    depth: "Se formó en el fondo marino; hoy aflora en superficie tras el levantamiento y la erosión",
    favorableConditions: "Agua cálida, clara y poco profunda con abundante vida constructora de conchas",
    worldRegions: ["Valle del Ohio (EE. UU.)", "Frontera galesa (Reino Unido)", "Gotland (Suecia)"],
    earthLayers: "Se formó y se conservó en la corteza continental superior.",
  },
  composition: {
    ...EXAMPLE_ANALYSIS.composition,
    minerals: [{ name: "Calcita", role: "Principal" }],
    chemistry: "Carbonato de calcio (CaCO₃)",
    mohsHardness: { min: 3, max: 3, note: "Típica de la calcita" },
    porosity: "Baja a moderada",
    density: { value: "2,5–2,7 g/cm³", note: "Típica de la caliza" },
    physicalProperties: "Burbujea con ácido diluido; se meteoriza por disolución.",
  },
  didYouKnow: [
    "Los braquiópodos parecen almejas, pero pertenecen a otra rama del reino animal.",
    "Todavía viven cientos de especies de braquiópodos.",
    "Su nombre significa «brazo-pie».",
  ],
  paleontology: {
    ...EXAMPLE_ANALYSIS.paleontology,
    organism: "Braquiópodos",
    periodLived: "Cámbrico – actualidad (dominantes en el Paleozoico)",
    habitat: "Fondo marino poco profundo",
    preservation: "Conchas originales de calcita",
    scientificImportance: "Las asociaciones de braquiópodos ayudan a datar y reconstruir los ambientes del Paleozoico.",
  },
  verificationSteps: ["Pon una gota de ácido diluido o vinagre sobre la matriz", "Examina la charnela con una lupa de mano"],
};

export function exampleAnalysis(lang: "es" | "en"): RockAnalysis {
  return lang === "es" ? EXAMPLE_ANALYSIS_ES : EXAMPLE_ANALYSIS;
}
