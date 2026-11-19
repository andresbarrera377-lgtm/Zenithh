import { defineMessages } from "../define";

type Step = { title: string; text: string };

export const app = defineMessages<{
  meta: {
    home: string;
    scan: { title: string; description: string };
    analysis: string;
    results: string;
    collection: { title: string; description: string };
    discovery: string;
    about: { title: string; description: string };
  };
  home: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lead: string;
    scan: string;
    explore: string;
    photo: Step;
    upload: Step;
    recent: string;
    myCollection: string;
    history: string;
    howItWorks: string;
    specimenOfDay: string;
    readEntry: string;
    exploreLibrary: string;
    viewAll: string;
    disclaimer: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: (name: string) => string;
    howTitle: string;
    pipeline: [Step, Step, Step, Step];
    noResultTitle: string;
    noResultText: string;
    verdictsTitle: string;
    verdictsLead: string;
    fossilsTitle: string;
    fossilsText: string;
    dataLabel: string;
    privacyTitle: string;
    privacyText: string;
    collectionTitle: string;
    collectionText: string;
    noticeTitle: string;
    noticeExtra: string;
    sources: string;
    cta: string;
  };
}>({
  es: {
    meta: {
      home: "Inicio",
      scan: { title: "Escanear roca", description: "Haz o sube una foto de una roca para identificarla con IA." },
      analysis: "Analizando",
      results: "Resultados",
      collection: { title: "Mi colección", description: "Tus análisis de rocas guardados, con fotos y notas." },
      discovery: "Descubrimiento",
      about: { title: "Acerca de", description: "Cómo analiza Dr.Rock las rocas, sus garantías científicas y su privacidad." },
    },
    home: {
      eyebrow: "Un laboratorio de geología en tu bolsillo",
      titleA: "Cada roca tiene una historia.",
      titleB: "Descubre la tuya.",
      lead: "Fotografía una roca y la IA de Dr.Rock examina su textura, sus minerales y sus estructuras para identificarla, buscar posibles fósiles y reconstruir su historia geológica, con niveles de confianza honestos.",
      scan: "Analizar una roca",
      explore: "Explorar la biblioteca",
      photo: { title: "Hacer una foto", text: "Usa la cámara para fotografiar un ejemplar." },
      upload: { title: "Subir imagen", text: "Analiza una foto de tu galería o tu ordenador." },
      recent: "Descubrimientos recientes",
      myCollection: "Mi colección",
      history: "Historial",
      howItWorks: "Cómo funciona →",
      specimenOfDay: "Ejemplar del día",
      readEntry: "Leer la ficha",
      exploreLibrary: "Explora la biblioteca de rocas",
      viewAll: "Ver todo",
      disclaimer:
        "ofrece estimaciones educativas a partir de fotografías. Los resultados no sustituyen el examen de un geólogo o paleontólogo profesional.",
    },
    about: {
      eyebrow: "Acerca de",
      title: "Un laboratorio geológico que cualquiera puede llevar en el bolsillo.",
      lead: (name) =>
        `${name} combina la inteligencia artificial con la geología y la paleontología para ayudar a las personas curiosas a entender las rocas que encuentran: qué son, cómo se formaron, qué edad pueden tener y si podrían guardar rastros de vida antigua.`,
      howTitle: "Cómo funciona un análisis",
      pipeline: [
        {
          title: "1 · Se prepara en tu dispositivo",
          text: "Hasta 3 fotos del mismo ejemplar se giran, se ajustan a 2576 px (la resolución máxima que lee la IA) y se vuelven a codificar en JPEG en tu navegador, que además comprueba si están enfocadas y bien expuestas. Se eliminan los metadatos EXIF, incluida la ubicación GPS.",
        },
        {
          title: "2 · Se envía a un servidor seguro",
          text: "El servidor de Dr.Rock valida el archivo (formato real, tamaño y dimensiones) y aplica límites de uso. La clave de la API del proveedor de IA solo existe en el servidor.",
        },
        {
          title: "3 · La examina una IA en dos pasadas",
          text: "Un modelo multimodal Claude estudia todas las fotos y tus pruebas de campo, decide si el objeto es natural o hecho por personas, compara las identificaciones posibles y redacta el informe. En una segunda pasada vuelve a mirar las fotos, revisa el informe y corrige lo que no encaje.",
        },
        {
          title: "4 · Se comprueba con reglas científicas",
          text: "El informe se valida con un esquema estricto y reglas de seguridad: afirmar que hay un fósil exige suficiente confianza, las edades son rangos (nunca exactas) y los fósiles nunca se sitúan fuera de la corteza.",
        },
      ],
      noResultTitle: "Sin conexión, no hay resultado",
      noResultText:
        "Si el servicio de IA no está disponible o no está configurado, Dr.Rock muestra un error. Nunca genera identificaciones de relleno ni inventadas.",
      verdictsTitle: "Los cuatro veredictos de fósiles",
      verdictsLead:
        "Una foto por sí sola no puede demostrar que una roca contiene un fósil: muchas estructuras minerales imitan organismos. Por eso cada análisis termina con uno de cuatro veredictos redactados con cuidado, con un nivel de confianza y su justificación.",
      fossilsTitle: "De dónde vienen los fósiles",
      fossilsText:
        "Los fósiles se forman cuando restos o huellas de organismos quedan enterrados en sedimentos que luego se convierten en roca. Eso ocurre en la superficie terrestre, así que los fósiles solo se encuentran en la corteza, sobre todo en rocas sedimentarias a pocos kilómetros de la superficie. El manto y el núcleo son demasiado calientes para que sobreviva nada biológico.",
      dataLabel: "Privacidad y datos",
      privacyTitle: "Privacidad",
      privacyText:
        "Las fotos se envían al proveedor de IA (Anthropic) solo para elaborar tu informe; el servidor de Dr.Rock no las guarda. Los metadatos de ubicación se eliminan antes de subirlas. Las notas de campo son opcionales.",
      collectionTitle: "Tu colección",
      collectionText:
        "Los descubrimientos guardados se quedan en este dispositivo, en el almacenamiento de tu navegador. Hay planes para cuentas y sincronización en la nube; hasta entonces, borrar los datos del navegador elimina la colección.",
      noticeTitle: "Aviso científico",
      noticeExtra:
        "No recolectes ejemplares donde esté prohibido y comunica los hallazgos fósiles importantes a un museo o servicio geológico.",
      sources:
        "Escala de tiempo geológico: Tabla Cronoestratigráfica Internacional (ICS). Las ilustraciones de la biblioteca las genera Dr.Rock por procedimientos y son representaciones artísticas, no fotografías.",
      cta: "Analizar una roca",
    },
  },
  en: {
    meta: {
      home: "Home",
      scan: { title: "Scan rock", description: "Take or upload a photo of a rock for AI-powered identification." },
      analysis: "Analyzing",
      results: "Results",
      collection: { title: "My Collection", description: "Your saved rock analyses, photos and notes." },
      discovery: "Discovery",
      about: { title: "About", description: "How Dr.Rock analyzes rocks, its scientific safeguards and privacy." },
    },
    home: {
      eyebrow: "Geology lab in your pocket",
      titleA: "Every rock has a story.",
      titleB: "Discover yours.",
      lead: "Photograph a rock and Dr.Rock's AI examines its texture, minerals and structures to identify it, look for possible fossils and reconstruct its geological history — with honest confidence levels.",
      scan: "Scan a rock",
      explore: "Explore the library",
      photo: { title: "Take a photo", text: "Use your camera to capture a specimen." },
      upload: { title: "Upload image", text: "Analyze a photo from your gallery or computer." },
      recent: "Recent discoveries",
      myCollection: "My Collection",
      history: "History",
      howItWorks: "How it works →",
      specimenOfDay: "Specimen of the day",
      readEntry: "Read entry",
      exploreLibrary: "Explore the Rock Library",
      viewAll: "View all",
      disclaimer:
        "provides educational estimates based on photographs. Results are not a substitute for examination by a professional geologist or paleontologist.",
    },
    about: {
      eyebrow: "About",
      title: "A geological laboratory anyone can carry in their pocket.",
      lead: (name) =>
        `${name} combines artificial intelligence with geology and paleontology to help curious people understand the rocks they find: what they are, how they formed, how old they might be and whether they could hold traces of ancient life.`,
      howTitle: "How an analysis works",
      pipeline: [
        {
          title: "1 · Prepared on your device",
          text: "Up to 3 photos of the same specimen are rotated, sized to 2576 px (the most detail the AI can read) and re-encoded as JPEG in your browser, which also checks that they are in focus and well exposed. EXIF metadata, including GPS location, is removed.",
        },
        {
          title: "2 · Sent to a secure backend",
          text: "Dr.Rock's server validates the file (real format, size, dimensions) and applies rate limits. The AI provider's API key exists only on the server.",
        },
        {
          title: "3 · Examined by an AI in two passes",
          text: "A multimodal Claude model studies every photo and your field tests, decides whether the object is natural or made by people, compares the possible identifications and writes the report. A second pass looks at the photos again, reviews the report and corrects anything that does not fit.",
        },
        {
          title: "4 · Checked against scientific rules",
          text: "The report is validated against a strict schema and safety rules: fossil claims need sufficient confidence, ages are ranges (never exact), and fossils are never placed outside the crust.",
        },
      ],
      noResultTitle: "No connection, no result",
      noResultText:
        "If the AI service is unavailable or not configured, Dr.Rock shows an error. It never produces placeholder or invented identifications.",
      verdictsTitle: "The four fossil verdicts",
      verdictsLead:
        "A photo alone cannot prove that a rock contains a fossil — many mineral structures imitate organisms. Every analysis therefore ends in one of four carefully worded verdicts, with a confidence level and the reasoning behind it.",
      fossilsTitle: "Where fossils come from",
      fossilsText:
        "Fossils form when remains or traces of organisms are buried in sediment that later turns to rock. That happens at Earth's surface, so fossils are found only in the crust — mostly in sedimentary rocks within a few kilometres of the surface. The mantle and core are far too hot for anything biological to survive.",
      dataLabel: "Privacy and data",
      privacyTitle: "Privacy",
      privacyText:
        "Photos are sent to the AI provider (Anthropic) only to produce your report; Dr.Rock's server does not store them. Location metadata is removed before upload. Field notes are optional.",
      collectionTitle: "Your collection",
      collectionText:
        "Saved discoveries stay on this device, in your browser's storage. Accounts and cloud sync are planned; until then, clearing your browser data deletes the collection.",
      noticeTitle: "Scientific notice",
      noticeExtra: "Never collect specimens where it is prohibited, and report significant fossil finds to a museum or geological survey.",
      sources:
        "Geological time scale: International Chronostratigraphic Chart (ICS). Library illustrations are generated procedurally by Dr.Rock and are artistic representations, not photographs.",
      cta: "Analyze a rock",
    },
  },
});
