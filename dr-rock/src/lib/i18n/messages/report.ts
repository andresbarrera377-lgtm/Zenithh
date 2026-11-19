import type { Classification, Origin, Verdict } from "../../analysis/schema";
import { defineMessages } from "../define";

type VerdictText = Record<Verdict, { label: string; short: string; description: string }>;
type ClassText = Record<Classification, { label: string; description: string }>;
type OriginText = Record<Origin, { label: string; short: string; description: string }>;
type Layer = { name: string; depth: string; detail: string };

export const report = defineMessages<{
  verdicts: VerdictText;
  classifications: ClassText;
  origins: OriginText;
  origin: {
    title: string;
    confidence: (n: number) => string;
    likely: string;
    imitates: string;
    evidence: string;
    heritage: string;
  };
  precision: {
    reviewed: string;
    reviewedText: string;
    photos: (n: number) => string;
    tests: (n: number) => string;
    improveTitle: string;
    improveText: string;
    improveButton: string;
  };
  levels: { high: string; moderate: string; low: string };
  summary: {
    eyebrow: string;
    photoOf: (name: string) => string;
    idConfidence: string;
    idConfidenceNote: string;
    possibleFossil: string;
    fossilConfidence: string;
    category: string;
    estimatedAge: string;
    confidence: string;
  };
  view: { fullReport: string; foundAt: string; size: string; notes: string; footer: (date: string, model: string, ref: string) => string };
  session: {
    emptyTitle: string;
    emptyText: string;
    scan: string;
    collection: string;
    saveError: string;
    saved: string;
    save: string;
    another: string;
    couldNotSave: string;
    savedNoteBefore: string;
    savedNoteLink: string;
  };
  full: {
    eyebrow: string;
    title: string;
    collapse: string;
    expand: string;
    section: (letter: string) => string;
    sections: { identification: string; age: string; setting: string; composition: string; facts: string; paleo: string; photo: string };
    notice: string;
    notDetermined: string;
    undetermined: string;
    observations: { texture: string; color: string; shape: string; patterns: string; structures: string; organicImpressions: string; mineralFormations: string; sedimentaryFeatures: string };
    probableName: string;
    rockType: string;
    classification: string;
    possibleFossils: string;
    fossilType: string;
    noneIdentified: string;
    confidence: string;
    confidenceValue: (id: number, fossil: number) => string;
    whyConfidence: string;
    featuresTitle: string;
    feature: string;
    observed: string;
    interpretation: string;
    aiObserved: string;
    alternatives: string;
    periods: string;
    era: string;
    approxAge: string;
    cannotEstimate: string;
    rockRange: string;
    fossilRange: string;
    rockAgeTitle: string;
    rockAgeNote: string;
    fossilAgeTitle: string;
    fossilAgeNote: string;
    formation: string;
    events: string;
    environments: string;
    strata: string;
    depth: string;
    conditions: string;
    regions: string;
    layers: string;
    minerals: string;
    noMinerals: string;
    chemistry: string;
    porosity: string;
    density: string;
    noDensity: string;
    physical: string;
    hardness: string;
    noFacts: string;
    noFossilDefault: string;
    paleo: { organism: string; group: string; lived: string; habitat: string; preservation: string; importance: string };
    notFromPhoto: string;
    quality: (q: string) => string;
    qualities: { good: string; fair: string; poor: string; unusable: string };
    noRock: string;
    limitations: string;
    noIssues: string;
    betterPhoto: string;
    verify: string;
  };
  mohs: { reference: string[]; none: string; typical: string; scaleNote: string };
  time: { today: string };
  earth: { aria: string; fossils: string; layers: [Layer, Layer, Layer, Layer] };
}>({
  es: {
    verdicts: {
      probable_fossil: { label: "Fósil probable", short: "Fósil probable", description: "Se ven rasgos orgánicos diagnósticos. Sigue siendo una estimación hasta que lo examine un especialista." },
      inconclusive_fossil_like: { label: "Parece un fósil, sin confirmar", short: "No concluyente", description: "Algo se parece a una estructura orgánica, pero la foto no muestra detalles diagnósticos." },
      no_visible_fossil: { label: "Sin evidencia visible de fósiles", short: "Sin fósil visible", description: "La roca se puede identificar y no se ven estructuras orgánicas en esta superficie." },
      insufficient_image: { label: "Imagen insuficiente", short: "Imagen insuficiente", description: "La foto no permite una conclusión responsable. Prueba con una foto más nítida, cercana y bien iluminada." },
    },
    classifications: {
      igneous: { label: "Ígnea", description: "Formada por el enfriamiento y la solidificación de magma o lava." },
      sedimentary: { label: "Sedimentaria", description: "Formada por sedimentos, minerales o restos orgánicos depositados y cementados." },
      metamorphic: { label: "Metamórfica", description: "Transformada por calor, presión o fluidos sin llegar a fundirse." },
      mineral: { label: "Mineral", description: "Una única sustancia cristalina de origen natural." },
      artificial: { label: "Artificial", description: "Material hecho por personas, no formado por la naturaleza." },
      unknown: { label: "Sin determinar", description: "No se pudo determinar la familia de la roca a partir de esta foto." },
    },
    origins: {
      natural: { label: "Natural", short: "Natural", description: "Formado por la naturaleza, sin señales de trabajo humano." },
      human_modified: {
        label: "Natural, trabajado por personas",
        short: "Modificado por personas",
        description: "Material natural que alguien cortó, pulió, tiñó, talló, restauró o ensambló.",
      },
      human_made: { label: "Hecho por personas", short: "Artificial", description: "Material u objeto fabricado: no es una roca, mineral ni fósil natural." },
      uncertain: { label: "Origen incierto", short: "Incierto", description: "Las fotos no bastan para saber si es natural o fabricado." },
    },
    origin: {
      title: "¿Natural o hecho por personas?",
      confidence: (n) => `Confianza ${n}\u00a0%`,
      likely: "Probablemente es",
      imitates: "Se parece a / se vende como",
      evidence: "Pistas observadas",
      heritage: "Si crees que es una herramienta o un objeto arqueológico, no lo guardes: avisa a las autoridades de patrimonio de tu zona.",
    },
    precision: {
      reviewed: "Verificado en 2 pasadas",
      reviewedText: "Un segundo análisis revisó el informe contra las fotos antes de mostrártelo.",
      photos: (n) => (n === 1 ? "1 foto analizada" : `${n} fotos analizadas`),
      tests: (n) => (n === 1 ? "1 prueba de campo" : `${n} pruebas de campo`),
      improveTitle: "Mejora la precisión",
      improveText: "La confianza es moderada. Añade lo que sugiere el informe (otra foto o una prueba sencilla) y vuelve a analizar: se mantienen tus fotos.",
      improveButton: "Añadir fotos o pruebas",
    },
    levels: { high: "Alta", moderate: "Media", low: "Baja" },
    summary: {
      eyebrow: "Informe de identificación",
      photoOf: (n) => `Foto de ${n}`,
      idConfidence: "Confianza en la identificación",
      idConfidenceNote: "Autoevaluada por la IA a partir de la evidencia visible",
      possibleFossil: "Posible fósil",
      fossilConfidence: "Confianza del veredicto sobre fósiles",
      category: "Categoría geológica",
      estimatedAge: "Edad estimada",
      confidence: "Confianza",
    },
    view: { fullReport: "Ver informe completo", foundAt: "Encontrada en", size: "Tamaño", notes: "Notas", footer: (d, m, r) => `Analizado ${d} · modelo ${m} · ref. ${r}` },
    session: {
      emptyTitle: "Aún no hay resultados",
      emptyText: "Analiza una roca para ver aquí su informe científico. Los análisis guardados están en Mi colección.",
      scan: "Escanear una roca",
      collection: "Mi colección",
      saveError: "No se pudo guardar el análisis en este dispositivo.",
      saved: "Guardado · abrir en la colección",
      save: "Guardar análisis",
      another: "Analizar otra roca",
      couldNotSave: "No se pudo guardar",
      savedNoteBefore: "Guardado en este dispositivo. Añade notas y etiquetas en ",
      savedNoteLink: "Mi colección",
    },
    full: {
      eyebrow: "Informe científico completo",
      title: "Lo que la ciencia nos puede contar",
      collapse: "Contraer todo",
      expand: "Desplegar todo",
      section: (l) => `Sección ${l}`,
      sections: { identification: "Identificación", age: "Edad e historia", setting: "Entorno geológico", composition: "Composición", facts: "¿Sabías que…?", paleo: "Valor paleontológico", photo: "Calidad de la foto y cómo verificar" },
      notice: "Aviso científico",
      notDetermined: "Sin determinar.",
      undetermined: "Sin determinar",
      observations: { texture: "Textura", color: "Color", shape: "Forma", patterns: "Patrones", structures: "Estructuras", organicImpressions: "Huellas de organismos", mineralFormations: "Formaciones minerales", sedimentaryFeatures: "Rasgos sedimentarios" },
      probableName: "Nombre probable",
      rockType: "Tipo de roca",
      classification: "Clasificación",
      possibleFossils: "Posibles fósiles",
      fossilType: "Tipo de fósil",
      noneIdentified: "Ninguno identificado",
      confidence: "Confianza",
      confidenceValue: (id, f) => `ID ${id}% · Fósil ${f}%`,
      whyConfidence: "Por qué estos niveles de confianza",
      featuresTitle: "Rasgos visuales que respaldan la identificación",
      feature: "Rasgo",
      observed: "Observado",
      interpretation: "Interpretación",
      aiObserved: "Lo que observó la IA",
      alternatives: "Otras posibilidades consideradas",
      periods: "Periodo(s)",
      era: "Era",
      approxAge: "Edad aprox.",
      cannotEstimate: "No se puede estimar a partir de una foto",
      rockRange: "Roca",
      fossilRange: "Grupo fósil",
      rockAgeTitle: "Edad estimada de la roca",
      rockAgeNote: "Estimada a partir de la edad típica de este tipo de roca: una foto no puede datar una roca.",
      fossilAgeTitle: "Edad del posible grupo fósil",
      fossilAgeNote: "Cuándo vivió este grupo de organismos. La roca que contiene un fósil puede tener la misma edad o haberse retrabajado después.",
      formation: "Cómo se formó probablemente",
      events: "Eventos geológicos relacionados",
      environments: "Entornos geológicos típicos",
      strata: "Capas y estratos",
      depth: "Profundidad",
      conditions: "Condiciones favorables",
      regions: "Regiones con ejemplares similares",
      layers: "Corteza, manto y núcleo",
      minerals: "Minerales probables",
      noMinerals: "No se pudo estimar el contenido mineral.",
      chemistry: "Composición química",
      porosity: "Porosidad",
      density: "Densidad",
      noDensity: "Sin valor fiable",
      physical: "Resistencia y rasgos físicos",
      hardness: "Dureza (escala de Mohs)",
      noFacts: "No hay curiosidades disponibles para este ejemplar.",
      noFossilDefault: "En esta foto no se ven indicios de fósiles. Los fósiles se forman casi exclusivamente en rocas sedimentarias; los demás tipos de roca rara vez los conservan.",
      paleo: { organism: "Posible organismo", group: "Grupo biológico", lived: "Cuándo vivió", habitat: "Hábitat", preservation: "Cómo se conservó", importance: "Importancia científica" },
      notFromPhoto: "No se puede determinar a partir de esta foto.",
      quality: (q) => `Calidad de la foto: ${q}`,
      qualities: { good: "buena", fair: "aceptable", poor: "mala", unusable: "inservible" },
      noRock: "No se detectó una roca",
      limitations: "Limitaciones de esta foto",
      noIssues: "No se detectaron problemas importantes.",
      betterPhoto: "Consejos para una foto mejor",
      verify: "Cómo confirmar la identificación",
    },
    mohs: {
      reference: ["Talco", "Yeso", "Calcita", "Fluorita", "Apatito", "Ortosa", "Cuarzo", "Topacio", "Corindón", "Diamante"],
      none: "No se puede estimar la dureza de este ejemplar.",
      typical: "Dureza típica:",
      scaleNote: "en la escala de Mohs. Como referencia: una uña ronda 2,5, una moneda de cobre 3,5, el acero 5,5 y el vidrio 5,5–6.",
    },
    time: { today: "Hoy" },
    earth: {
      aria: "Corte de las capas de la Tierra",
      fossils: "fósiles",
      layers: [
        { name: "Corteza", depth: "0 – de 5 a 70 km", detail: "Fina capa rocosa: ~5–10 km bajo los océanos y ~30–70 km bajo los continentes. Todas las rocas que puedes recoger —y todos los fósiles— vienen de aquí." },
        { name: "Manto", depth: "hasta ~2900 km", detail: "Roca silicatada caliente que fluye muy despacio. Es el origen de la mayor parte del magma, pero nunca contiene fósiles." },
        { name: "Núcleo externo", depth: "2900 – 5150 km", detail: "Hierro y níquel líquidos. Su movimiento genera el campo magnético de la Tierra." },
        { name: "Núcleo interno", depth: "5150 – 6371 km", detail: "Esfera sólida de hierro y níquel, tan caliente como la superficie del Sol (más de ~5000 °C)." },
      ],
    },
  },
  en: {
    verdicts: {
      probable_fossil: { label: "Probable fossil", short: "Probable fossil", description: "Diagnostic organic features are visible. Still an estimate until examined by a specialist." },
      inconclusive_fossil_like: { label: "Fossil-like, not conclusive", short: "Inconclusive", description: "Something resembles an organic structure, but the photo does not show diagnostic detail." },
      no_visible_fossil: { label: "No visible fossil evidence", short: "No fossil seen", description: "The rock can be identified and no organic structures are visible on this surface." },
      insufficient_image: { label: "Image insufficient", short: "Insufficient image", description: "The photo does not allow a responsible conclusion. Try a sharper, closer, well-lit photo." },
    },
    classifications: {
      igneous: { label: "Igneous", description: "Formed by cooling and solidification of magma or lava." },
      sedimentary: { label: "Sedimentary", description: "Formed from deposited and cemented sediments, minerals or organic remains." },
      metamorphic: { label: "Metamorphic", description: "Transformed by heat, pressure or fluids without melting." },
      mineral: { label: "Mineral", description: "A single naturally occurring crystalline substance." },
      artificial: { label: "Artificial", description: "A material made by people, not formed by nature." },
      unknown: { label: "Undetermined", description: "The rock family could not be determined from this photo." },
    },
    origins: {
      natural: { label: "Natural", short: "Natural", description: "Formed by nature, with no sign of human work." },
      human_modified: {
        label: "Natural, worked by people",
        short: "Human-modified",
        description: "Natural material that someone cut, polished, dyed, carved, restored or assembled.",
      },
      human_made: { label: "Made by people", short: "Artificial", description: "A manufactured material or object — not a natural rock, mineral or fossil." },
      uncertain: { label: "Origin uncertain", short: "Uncertain", description: "The photos are not enough to tell whether it is natural or manufactured." },
    },
    origin: {
      title: "Natural or made by people?",
      confidence: (n) => `${n}% confidence`,
      likely: "Most likely",
      imitates: "Resembles / sold as",
      evidence: "Clues observed",
      heritage: "If you think it is a tool or an archaeological object, don't keep it: report it to your local heritage authorities.",
    },
    precision: {
      reviewed: "Checked in 2 passes",
      reviewedText: "A second analysis reviewed the report against the photos before showing it to you.",
      photos: (n) => (n === 1 ? "1 photo analyzed" : `${n} photos analyzed`),
      tests: (n) => (n === 1 ? "1 field test" : `${n} field tests`),
      improveTitle: "Improve the accuracy",
      improveText: "Confidence is moderate. Add what the report suggests (another photo or a simple test) and analyze again — your photos are kept.",
      improveButton: "Add photos or tests",
    },
    levels: { high: "High", moderate: "Moderate", low: "Low" },
    summary: {
      eyebrow: "Identification report",
      photoOf: (n) => `Photo of ${n}`,
      idConfidence: "Identification confidence",
      idConfidenceNote: "Self-assessed by the AI from visible evidence",
      possibleFossil: "Possible fossil",
      fossilConfidence: "Fossil verdict confidence",
      category: "Geological category",
      estimatedAge: "Estimated age",
      confidence: "Confidence",
    },
    view: { fullReport: "View full report", foundAt: "Found at", size: "Size", notes: "Notes", footer: (d, m, r) => `Analyzed ${d} · model ${m} · ref ${r}` },
    session: {
      emptyTitle: "No results yet",
      emptyText: "Analyze a rock to see its scientific report here. Saved analyses live in My Collection.",
      scan: "Scan a rock",
      collection: "My Collection",
      saveError: "The analysis could not be saved on this device.",
      saved: "Saved · open in collection",
      save: "Save analysis",
      another: "Analyze another rock",
      couldNotSave: "Could not save",
      savedNoteBefore: "Saved on this device. Add notes and tags in ",
      savedNoteLink: "My Collection",
    },
    full: {
      eyebrow: "Full scientific report",
      title: "What science can tell us",
      collapse: "Collapse all",
      expand: "Expand all",
      section: (l) => `Section ${l}`,
      sections: { identification: "Identification", age: "Age & history", setting: "Geological setting", composition: "Composition", facts: "Did you know?", paleo: "Paleontological value", photo: "Photo quality & how to verify" },
      notice: "Scientific notice",
      notDetermined: "Not determined.",
      undetermined: "Undetermined",
      observations: { texture: "Texture", color: "Color", shape: "Shape", patterns: "Patterns", structures: "Structures", organicImpressions: "Organism impressions", mineralFormations: "Mineral formations", sedimentaryFeatures: "Sedimentary features" },
      probableName: "Probable name",
      rockType: "Rock type",
      classification: "Classification",
      possibleFossils: "Possible fossils",
      fossilType: "Fossil type",
      noneIdentified: "None identified",
      confidence: "Confidence",
      confidenceValue: (id, f) => `ID ${id}% · Fossil ${f}%`,
      whyConfidence: "Why these confidence levels",
      featuresTitle: "Visual features supporting the identification",
      feature: "Feature",
      observed: "Observed",
      interpretation: "Interpretation",
      aiObserved: "What the AI observed",
      alternatives: "Other possibilities considered",
      periods: "Period(s)",
      era: "Era",
      approxAge: "Approx. age",
      cannotEstimate: "Cannot be estimated from a photo",
      rockRange: "Rock",
      fossilRange: "Fossil group",
      rockAgeTitle: "Estimated age of the rock",
      rockAgeNote: "Estimated from the typical age of this rock type — a photo cannot date a rock.",
      fossilAgeTitle: "Age of the possible fossil group",
      fossilAgeNote: "When this group of organisms lived. The rock that holds a fossil can be the same age or reworked later.",
      formation: "How it probably formed",
      events: "Related geological events",
      environments: "Typical geological environments",
      strata: "Layers & strata",
      depth: "Depth",
      conditions: "Favourable conditions",
      regions: "Regions with similar specimens",
      layers: "Crust, mantle and core",
      minerals: "Probable minerals",
      noMinerals: "Mineral content could not be estimated.",
      chemistry: "Chemical composition",
      porosity: "Porosity",
      density: "Density",
      noDensity: "No reliable value",
      physical: "Strength & physical traits",
      hardness: "Hardness (Mohs scale)",
      noFacts: "No facts available for this specimen.",
      noFossilDefault: "No fossil indications are visible in this photo. Fossils form almost exclusively in sedimentary rocks; other rock types rarely preserve them.",
      paleo: { organism: "Possible organism", group: "Biological group", lived: "When it lived", habitat: "Habitat", preservation: "How it was preserved", importance: "Scientific importance" },
      notFromPhoto: "Not determinable from this photo.",
      quality: (q) => `Photo quality: ${q}`,
      qualities: { good: "good", fair: "fair", poor: "poor", unusable: "unusable" },
      noRock: "No rock detected",
      limitations: "Limitations of this photo",
      noIssues: "No significant issues detected.",
      betterPhoto: "Tips for a better photo",
      verify: "How to confirm the identification",
    },
    mohs: {
      reference: ["Talc", "Gypsum", "Calcite", "Fluorite", "Apatite", "Orthoclase", "Quartz", "Topaz", "Corundum", "Diamond"],
      none: "Hardness can't be estimated for this specimen.",
      typical: "Typical hardness:",
      scaleNote: "on the Mohs scale. For reference, a fingernail is ~2.5, a copper coin ~3.5, steel ~5.5 and glass ~5.5–6.",
    },
    time: { today: "Today" },
    earth: {
      aria: "Cross-section of Earth's layers",
      fossils: "fossils",
      layers: [
        { name: "Crust", depth: "0 – 5 to 70 km", detail: "Thin rocky shell: ~5–10 km under oceans, ~30–70 km under continents. All rocks you can collect — and every fossil — come from here." },
        { name: "Mantle", depth: "to ~2,900 km", detail: "Hot silicate rock that flows very slowly. It is the source of most magma, but it never contains fossils." },
        { name: "Outer core", depth: "2,900 – 5,150 km", detail: "Liquid iron–nickel. Its motion generates Earth's magnetic field." },
        { name: "Inner core", depth: "5,150 – 6,371 km", detail: "Solid iron–nickel ball, as hot as the Sun's surface (~5,000 °C+)." },
      ],
    },
  },
});
