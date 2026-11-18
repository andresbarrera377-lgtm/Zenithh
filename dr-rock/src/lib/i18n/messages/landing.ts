import { defineMessages } from "../define";

type Item = { title: string; text: string };

export const landing = defineMessages<{
  metaTitle: string;
  nav: { about: string; how: string; features: string; preview: string; download: string; openApp: string; openWebApp: string; openMenu: string; closeMenu: string };
  hero: { title1: string; title2: string; lead: string; explore: string; download: string; worksIn: string; scroll: string };
  about: { eyebrow: string; title: string; lead: string; items: Item[] };
  how: { eyebrow: string; title: string; steps: Item[] };
  features: { eyebrow: string; title: string; lead: string; items: Item[]; libraryText: (n: number) => string };
  preview: { eyebrow: string; title: string; lead: string; scanCaption: string; resultsCaption: string; libraryCaption: (n: number) => string; analyzing: string; step: string; searching: string; encyclopedia: string; library: string; searchPlaceholder: string };
  download: {
    eyebrow: string;
    title: string;
    lead: string;
    available: string;
    androidText: string;
    downloadApk: string;
    apkFootnote: (version: string, size: string, minAndroid: string) => string;
    desktopName: string;
    desktopText: string;
    openWebApp: string;
    desktopFootnote: string;
    iphoneText: string;
    iphoneFootnote: string;
    footnote: string;
  };
  faq: { eyebrow: string; title: string; items: Array<{ q: string; a: string }>; cta: string };
  footer: { explore: string; webApp: string; scan: string; library: string; about: string; contact: string; contactSoon: string; notice: string; rights: string; footerNav: string };
}>({
  es: {
    metaTitle: "Dr.Rock — Cada roca tiene una historia. Descubre la tuya.",
    nav: { about: "Qué es", how: "Cómo funciona", features: "Funciones", preview: "Vista previa", download: "Descargar", openApp: "Abrir app", openWebApp: "Abrir la app web", openMenu: "Abrir menú", closeMenu: "Cerrar menú" },
    hero: {
      title1: "Cada roca tiene una historia.",
      title2: "Descubre la tuya.",
      lead: "Dr.Rock es un laboratorio de geología con IA en tu bolsillo. Fotografía una roca para identificarla, buscar señales de vida antigua y descubrir su viaje a través del tiempo profundo.",
      explore: "Explorar Dr.Rock",
      download: "Descargar app",
      worksIn: "Funciona en el navegador de Android, iPhone, Windows y Mac.",
      scroll: "Ir a la sección Qué es",
    },
    about: {
      eyebrow: "Qué es",
      title: "Donde la inteligencia artificial se encuentra con la ciencia de las rocas",
      lead: "Dr.Rock combina un modelo de IA multimodal con el razonamiento de geólogos y paleontólogos. Lee las pistas que guardan las rocas —cristales, granos, capas, conchas e impresiones— y las convierte en una explicación clara y responsable de lo que tienes en la mano.",
      items: [
        { title: "Primero, la evidencia", text: "Cada identificación enumera los rasgos visibles que la respaldan y las alternativas consideradas." },
        { title: "Honesto por diseño", text: "Niveles de confianza, veredictos prudentes sobre fósiles y rangos de edad: nunca una edad exacta inventada ni un resultado falso." },
        { title: "Hecho para enseñar", text: "Cada informe explica cómo se formó la roca, dónde aparece y qué nos cuenta sobre la historia de la Tierra." },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Tres pasos del guijarro a la prehistoria",
      steps: [
        { title: "Haz una foto", text: "Fotografía una roca con el móvil o sube una imagen desde tu ordenador. Las notas de campo son opcionales." },
        { title: "La IA la analiza", text: "Una IA multimodal examina textura, color, estructuras, minerales y posibles huellas de organismos." },
        { title: "Descubre su historia geológica", text: "Recibe un informe científico: identificación, veredicto sobre fósiles, rango de edad, entorno, composición y curiosidades." },
      ],
    },
    features: {
      eyebrow: "Funciones",
      title: "Un laboratorio de campo completo",
      lead: "Todo lo que necesita un explorador curioso para entender un ejemplar y guardar registro de cada descubrimiento.",
      items: [
        { title: "Detección de fósiles con IA", text: "Cuatro veredictos honestos —de fósil probable a imagen insuficiente— con niveles de confianza y el razonamiento que hay detrás." },
        { title: "Identificación de rocas", text: "Nombre probable, tipo de roca y familia (ígnea, sedimentaria, metamórfica), respaldados por los rasgos visibles que lo justifican." },
        { title: "Estimación de la edad geológica", text: "Periodo, era y rangos de edad en una escala de tiempo interactiva, separando la edad de la roca de la del fósil." },
        { title: "Composición mineral", text: "Minerales probables, química, dureza de Mohs, porosidad y densidad, a partir de valores típicos publicados." },
        { title: "Enciclopedia geológica", text: "" },
        { title: "Tu colección de rocas", text: "Guarda análisis con sus fotos, añade notas y etiquetas, marca favoritos y organiza tus descubrimientos, en privado en tu dispositivo." },
      ],
      libraryText: (n) => `La Biblioteca de rocas: ${n} fichas ilustradas de rocas, fósiles, minerales, periodos y eras, con búsqueda y filtros.`,
    },
    preview: {
      eyebrow: "Vista previa",
      title: "Diseñada como un instrumento científico",
      lead: "Una interfaz limpia y centrada que funciona igual de bien en la orilla embarrada de un río que en un escritorio. El informe que se muestra es un ejemplo ilustrativo, no un análisis real.",
      scanCaption: "Animación de escaneo mientras trabaja la IA",
      resultsCaption: "Resultados de un vistazo — ejemplo ilustrativo",
      libraryCaption: (n) => `${n} fichas ilustradas en la biblioteca`,
      analyzing: "Analizando ejemplar",
      step: "Paso 2 · Análisis",
      searching: "Buscando patrones fósiles…",
      encyclopedia: "Enciclopedia",
      library: "Biblioteca de rocas",
      searchPlaceholder: "Buscar rocas, fósiles…",
    },
    download: {
      eyebrow: "Descargar",
      title: "Dr.Rock en cualquier dispositivo",
      lead: "Empieza a explorar ahora mismo en tu navegador e instálala como app en tu teléfono u ordenador.",
      available: "Disponible",
      androidText: "Descarga la app de Dr.Rock e instálala en tu teléfono: icono en la pantalla de inicio, pantalla completa y acceso directo a la cámara.",
      downloadApk: "Descargar APK",
      apkFootnote: (v, s, a) => `Versión ${v} · ${s} · Android ${a} o superior. La primera vez, Android te pedirá permitir instalar apps desde tu navegador o gestor de archivos.`,
      desktopName: "Windows y Mac",
      desktopText: "Instala Dr.Rock como app de escritorio directamente desde el navegador: su propia ventana y un icono en el menú Inicio o en el Dock.",
      openWebApp: "Abrir la app web",
      desktopFootnote: "En Chrome o Edge, pulsa el icono de instalar de la barra de direcciones. En Safari para Mac, elige Archivo › Añadir al Dock.",
      iphoneText: "Añade Dr.Rock a tu pantalla de inicio desde Safari en cuatro toques: icono propio, pantalla completa y pantalla de inicio, como cualquier app.",
      iphoneFootnote: "Apple solo permite descargar apps desde la App Store, así que en iPhone Dr.Rock se instala desde Safari, sin necesidad de App Store.",
      footnote: "Todas las versiones usan el mismo análisis con IA, que necesita conexión a internet. Tu colección se guarda en cada dispositivo.",
    },
    faq: {
      eyebrow: "Preguntas",
      title: "Lo que preguntan los exploradores",
      items: [
        { q: "¿Es fiable?", a: "Identificar una roca a partir de una foto es una estimación fundamentada. Dr.Rock muestra cuánta confianza tiene la IA, explica por qué y lo dice claramente cuando una foto no basta. Confirma los hallazgos importantes con un geólogo, un museo o un servicio geológico." },
        { q: "¿De verdad sabe si mi roca tiene un fósil?", a: "Busca rasgos que son diagnósticos de fósiles y los compara con imitaciones como las dendritas minerales o las concreciones. Nunca afirma con certeza que hay un fósil solo por su aspecto: el veredicto es probable, no concluyente, no visible o imagen insuficiente." },
        { q: "¿Qué pasa con mis fotos?", a: "Las fotos se reducen y se les quitan los metadatos (incluido el GPS) en tu dispositivo, se envían a la IA solo para generar tu informe y no se conservan en los servidores de Dr.Rock. Tu colección se guarda localmente en tu navegador." },
        { q: "¿Tengo que instalar algo?", a: "No. Dr.Rock funciona en el navegador de Android, iPhone, Windows y Mac. Si prefieres una app, descarga el APK de Android en la sección Descargar, o instálala desde el navegador en un ordenador o iPhone." },
      ],
      cta: "Empezar a explorar",
    },
    footer: { explore: "Explorar", webApp: "App web", scan: "Escanear una roca", library: "Biblioteca de rocas", about: "Acerca de Dr.Rock", contact: "Contacto", contactSoon: "Datos de contacto próximamente.", notice: "Aviso científico:", rights: "Todos los derechos reservados.", footerNav: "Pie de página" },
  },
  en: {
    metaTitle: "Dr.Rock — Every rock has a story. Discover yours.",
    nav: { about: "About", how: "How it works", features: "Features", preview: "Preview", download: "Download", openApp: "Open app", openWebApp: "Open the web app", openMenu: "Open menu", closeMenu: "Close menu" },
    hero: {
      title1: "Every rock has a story.",
      title2: "Discover yours.",
      lead: "Dr.Rock is an AI-powered geology lab in your pocket. Photograph a rock to identify it, look for signs of ancient life and uncover its journey through deep time.",
      explore: "Explore Dr.Rock",
      download: "Download app",
      worksIn: "Works in your browser on Android, iPhone, Windows and Mac.",
      scroll: "Scroll to About",
    },
    about: {
      eyebrow: "About",
      title: "Where artificial intelligence meets the science of rocks",
      lead: "Dr.Rock combines a multimodal AI model with the reasoning of geologists and paleontologists. It reads the clues that rocks keep — crystals, grains, layers, shells and imprints — and turns them into a clear, responsible explanation of what you're holding.",
      items: [
        { title: "Evidence first", text: "Every identification lists the visible features that support it, and the alternatives considered." },
        { title: "Honest by design", text: "Confidence levels, careful fossil verdicts and age ranges — never an invented exact age or a fake result." },
        { title: "Built to teach", text: "Each report explains how the rock formed, where it occurs and what it tells us about Earth's history." },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Three steps from pebble to prehistory",
      steps: [
        { title: "Capture a photo", text: "Photograph a rock with your phone or upload an image from your computer. Field notes are optional." },
        { title: "Let AI analyze it", text: "A multimodal AI examines texture, colour, structures, minerals and possible organism impressions." },
        { title: "Discover its geological history", text: "Get a scientific report: identification, fossil verdict, age range, setting, composition and curiosities." },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "A complete field laboratory",
      lead: "Everything a curious explorer needs to understand a specimen — and to keep a record of every discovery.",
      items: [
        { title: "AI Fossil Detection", text: "Four honest verdicts — from probable fossil to insufficient image — with confidence levels and the reasoning behind them." },
        { title: "Rock Identification", text: "Probable name, rock type and family (igneous, sedimentary, metamorphic) backed by the visible features that justify it." },
        { title: "Geological Age Estimation", text: "Period, era and age ranges on an interactive time scale — keeping the age of the rock separate from the age of the fossil." },
        { title: "Mineral Composition", text: "Probable minerals, chemistry, Mohs hardness, porosity and density, drawn from typical published values." },
        { title: "Geological Encyclopedia", text: "" },
        { title: "Personal Rock Collection", text: "Save analyses with their photos, add notes and tags, mark favourites and organise your discoveries — privately on your device." },
      ],
      libraryText: (n) => `The Rock Library: ${n} illustrated entries on rocks, fossils, minerals, periods and eras, with search and filters.`,
    },
    preview: {
      eyebrow: "Preview",
      title: "Designed like a scientific instrument",
      lead: "A clean, focused interface that works as well on a muddy riverbank as on a desktop. The report shown is an illustrative example, not a live analysis.",
      scanCaption: "Scanning animation while the AI works",
      resultsCaption: "Results at a glance — illustrative example",
      libraryCaption: (n) => `${n} illustrated library entries`,
      analyzing: "Analyzing specimen",
      step: "Step 2 · Analysis",
      searching: "Searching for fossil patterns…",
      encyclopedia: "Encyclopedia",
      library: "Rock Library",
      searchPlaceholder: "Search rocks, fossils…",
    },
    download: {
      eyebrow: "Download",
      title: "Get Dr.Rock on any device",
      lead: "Start exploring right now in your browser, and install it as an app on your phone or computer.",
      available: "Available",
      androidText: "Download the Dr.Rock app and install it on your phone: home-screen icon, full screen and direct access to the camera.",
      downloadApk: "Download APK",
      apkFootnote: (v, s, a) => `Version ${v} · ${s} · Android ${a} or later. The first time, Android asks you to allow installing apps from your browser or file manager.`,
      desktopName: "Windows & Mac",
      desktopText: "Install Dr.Rock as a desktop app straight from your browser: its own window and an icon in the Start menu or Dock.",
      openWebApp: "Open the web app",
      desktopFootnote: "In Chrome or Edge, click the install icon in the address bar. In Safari on Mac, choose File › Add to Dock.",
      iphoneText: "Add Dr.Rock to your Home Screen from Safari in four taps: its own icon, full screen and a launch screen, like any app.",
      iphoneFootnote: "Apple only allows apps from the App Store to be downloaded, so on iPhone Dr.Rock installs from Safari, with no App Store needed.",
      footnote: "Every version uses the same AI analysis, which needs an internet connection. Your collection is saved on each device.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions explorers ask",
      items: [
        { q: "How accurate is it?", a: "Identification from a photo is an educated estimate. Dr.Rock shows how confident the AI is, explains why, and says so plainly when a photo isn't enough. Confirm important finds with a geologist, museum or geological survey." },
        { q: "Can it really tell if my rock has a fossil?", a: "It looks for features that are diagnostic of fossils and weighs look-alikes such as mineral dendrites and concretions. It never claims a fossil from appearance alone with certainty: the verdict is probable, inconclusive, not visible, or insufficient image." },
        { q: "What happens to my photos?", a: "Photos are resized and stripped of metadata (including GPS) on your device, sent to the AI only to generate your report, and not kept on Dr.Rock's servers. Your collection is saved locally in your browser." },
        { q: "Do I need to install anything?", a: "No. Dr.Rock runs in your browser on Android, iPhone, Windows and Mac. If you prefer an app, download the Android APK from the Download section, or install it from your browser on a computer or iPhone." },
      ],
      cta: "Start exploring",
    },
    footer: { explore: "Explore", webApp: "Web app", scan: "Scan a rock", library: "Rock Library", about: "About Dr.Rock", contact: "Contact", contactSoon: "Contact details coming soon.", notice: "Scientific notice:", rights: "All rights reserved.", footerNav: "Footer" },
  },
});
