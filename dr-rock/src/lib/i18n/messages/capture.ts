import type { PhotoRole } from "../../analysis/photos";
import type { QualityWarning } from "../../image/quality";
import { defineMessages } from "../define";

type Slot = { title: string; hint: string };
type Test<O extends string> = { label: string; help: string; options: Record<O, string> };

export const capture = defineMessages<{
  slots: Record<PhotoRole, Slot>;
  photosTitle: string;
  photosText: string;
  camera: string;
  gallery: string;
  remove: string;
  replace: string;
  photoAlt: (title: string) => string;
  quality: { good: string; fair: string; poor: string };
  warnings: Record<QualityWarning, string>;
  autoDetail: string;
  meter: {
    title: string;
    levels: { basic: string; good: string; great: string };
    tips: { closeup: string; other: string; tests: string; quality: string; location: string };
    allDone: string;
  };
  tests: {
    title: string;
    subtitle: string;
    notTested: string;
    fizz: Test<"strong" | "weak" | "none">;
    hardness: Test<"soft" | "medium" | "hard">;
    magnet: Test<"strong" | "weak" | "none">;
    heft: Test<"light" | "normal" | "heavy">;
    streak: { label: string; help: string; placeholder: string };
    safety: string;
    count: (n: number) => string;
  };
  cam: {
    shotOf: (n: number, max: number) => string;
    done: string;
    saved: string;
    zoom: string;
    focus: string;
    next: (title: string) => string;
  };
  analyzeCount: (n: number) => string;
  timeNote: string;
  progress: { analyzing: string; reviewing: string; analyzingText: string; reviewingText: string };
}>({
  es: {
    slots: {
      overview: { title: "Vista general", hint: "La roca entera, centrada y llenando el encuadre" },
      closeup: { title: "Primer plano", hint: "Textura, granos o cristales muy de cerca" },
      other: { title: "Otro lado o escala", hint: "La cara opuesta, una rotura fresca o junto a una moneda" },
    },
    photosTitle: "Fotos del ejemplar",
    photosText: "Hasta 3 fotos del mismo ejemplar. Cada foto extra hace el análisis más preciso.",
    camera: "Cámara",
    gallery: "Galería",
    remove: "Quitar foto",
    replace: "Cambiar foto",
    photoAlt: (title) => `Foto: ${title}`,
    quality: { good: "Nítida", fair: "Aceptable", poor: "Mejorable" },
    warnings: {
      blurry: "Parece desenfocada: repítela con el teléfono quieto y tocando la roca en la pantalla para enfocar.",
      soft: "El enfoque es algo suave: aléjate un poco o toca la roca en la pantalla para enfocar.",
      dark: "Está oscura: busca más luz natural.",
      overexposed: "Hay zonas quemadas por la luz: evita el sol directo y el flash.",
      lowContrast: "Tiene poco contraste: prueba con otro fondo o con luz lateral.",
      lowRes: "Resolución baja: usa la foto original o la cámara.",
    },
    autoDetail: "También se enviará un recorte del centro de la foto a máxima resolución, para que la IA vea la textura más fina.",
    meter: {
      title: "Precisión de los datos",
      levels: { basic: "Básica", good: "Buena", great: "Excelente" },
      tips: {
        closeup: "Añade un primer plano de la textura",
        other: "Añade otra cara o una moneda como escala",
        tests: "Haz 1 o 2 pruebas rápidas (vinagre, rayado, imán)",
        quality: "Repite las fotos marcadas como mejorables",
        location: "Indica dónde la encontraste",
      },
      allDone: "Tienes todo lo necesario para un análisis muy preciso.",
    },
    tests: {
      title: "Pruebas rápidas",
      subtitle: "Opcionales, pero mejoran mucho la precisión. Marca solo lo que hayas probado.",
      notTested: "Sin probar",
      fizz: {
        label: "Vinagre",
        help: "Pon unas gotas de vinagre sobre la roca. ¿Burbujea?",
        options: { strong: "Burbujea mucho", weak: "Poco o lento", none: "No burbujea" },
      },
      hardness: {
        label: "Dureza",
        help: "Intenta rayarla con la uña y con una navaja o un clavo, y rayar un vidrio con ella.",
        options: { soft: "La uña la raya", medium: "La navaja la raya, la uña no", hard: "Raya el vidrio" },
      },
      magnet: {
        label: "Imán",
        help: "Acerca un imán. ¿Se pega?",
        options: { strong: "Se pega fuerte", weak: "Atrae un poco", none: "No atrae" },
      },
      heft: {
        label: "Peso",
        help: "Comparada con una piedra normal del mismo tamaño:",
        options: { light: "Muy ligera", normal: "Normal", heavy: "Muy pesada" },
      },
      streak: {
        label: "Color de la raya",
        help: "Frótala sobre porcelana sin esmaltar (el dorso de un azulejo). ¿De qué color es el polvo?",
        placeholder: "p. ej. rojiza, negra, blanca",
      },
      safety: "No pruebes sabores ni uses ácidos fuertes. Haz las pruebas en una zona poco visible.",
      count: (n) => (n === 0 ? "Ninguna hecha" : n === 1 ? "1 prueba hecha" : `${n} pruebas hechas`),
    },
    cam: {
      shotOf: (n, max) => `Foto ${n} de ${max}`,
      done: "Listo",
      saved: "Foto guardada",
      zoom: "Zoom",
      focus: "Toca la roca para enfocar",
      next: (title) => `Siguiente: ${title}`,
    },
    analyzeCount: (n) => (n === 1 ? "Analizar 1 foto" : `Analizar ${n} fotos`),
    timeNote: "Dos pasadas: análisis y verificación. Suele tardar entre 1 y 3 minutos.",
    progress: {
      analyzing: "Pasada 1 de 2 · Analizando",
      reviewing: "Pasada 2 de 2 · Verificando",
      analyzingText: "La IA examina cada foto y compara las posibles identificaciones.",
      reviewingText: "Una segunda revisión comprueba el informe contra las fotos: origen natural o artificial, alternativas y confianza.",
    },
  },
  en: {
    slots: {
      overview: { title: "Overview", hint: "The whole rock, centred and filling the frame" },
      closeup: { title: "Close-up", hint: "Texture, grains or crystals up close" },
      other: { title: "Other side or scale", hint: "The opposite face, a fresh break or next to a coin" },
    },
    photosTitle: "Photos of the specimen",
    photosText: "Up to 3 photos of the same specimen. Each extra photo makes the analysis more accurate.",
    camera: "Camera",
    gallery: "Gallery",
    remove: "Remove photo",
    replace: "Replace photo",
    photoAlt: (title) => `Photo: ${title}`,
    quality: { good: "Sharp", fair: "OK", poor: "Could be better" },
    warnings: {
      blurry: "Looks out of focus: retake it holding the phone still and tapping the rock on screen to focus.",
      soft: "Focus is a little soft: step back slightly or tap the rock on screen to focus.",
      dark: "It's dark: find more natural light.",
      overexposed: "Some areas are blown out: avoid direct sun and flash.",
      lowContrast: "Low contrast: try another background or side lighting.",
      lowRes: "Low resolution: use the original photo or the camera.",
    },
    autoDetail: "A full-resolution crop of the centre of the photo will also be sent, so the AI sees the finest texture.",
    meter: {
      title: "Data accuracy",
      levels: { basic: "Basic", good: "Good", great: "Excellent" },
      tips: {
        closeup: "Add a close-up of the texture",
        other: "Add another side or a coin for scale",
        tests: "Do 1 or 2 quick tests (vinegar, scratch, magnet)",
        quality: "Retake the photos marked “could be better”",
        location: "Say where you found it",
      },
      allDone: "You have everything for a very accurate analysis.",
    },
    tests: {
      title: "Quick tests",
      subtitle: "Optional, but they greatly improve accuracy. Only mark what you actually tested.",
      notTested: "Not tested",
      fizz: {
        label: "Vinegar",
        help: "Put a few drops of vinegar on the rock. Does it fizz?",
        options: { strong: "Fizzes a lot", weak: "A little or slowly", none: "No fizz" },
      },
      hardness: {
        label: "Hardness",
        help: "Try to scratch it with a fingernail and with a knife or nail, and try to scratch glass with it.",
        options: { soft: "Fingernail scratches it", medium: "Knife scratches it, nail doesn't", hard: "It scratches glass" },
      },
      magnet: {
        label: "Magnet",
        help: "Bring a magnet close. Does it stick?",
        options: { strong: "Sticks firmly", weak: "Weak pull", none: "No pull" },
      },
      heft: {
        label: "Weight",
        help: "Compared with an ordinary stone of the same size:",
        options: { light: "Very light", normal: "Normal", heavy: "Very heavy" },
      },
      streak: {
        label: "Streak colour",
        help: "Rub it on unglazed porcelain (the back of a tile). What colour is the powder?",
        placeholder: "e.g. reddish, black, white",
      },
      safety: "Don't taste rocks or use strong acids. Test on an inconspicuous spot.",
      count: (n) => (n === 0 ? "None done" : n === 1 ? "1 test done" : `${n} tests done`),
    },
    cam: {
      shotOf: (n, max) => `Photo ${n} of ${max}`,
      done: "Done",
      saved: "Photo saved",
      zoom: "Zoom",
      focus: "Tap the rock to focus",
      next: (title) => `Next: ${title}`,
    },
    analyzeCount: (n) => (n === 1 ? "Analyze 1 photo" : `Analyze ${n} photos`),
    timeNote: "Two passes: analysis and verification. Usually takes 1–3 minutes.",
    progress: {
      analyzing: "Pass 1 of 2 · Analyzing",
      reviewing: "Pass 2 of 2 · Verifying",
      analyzingText: "The AI examines each photo and compares the possible identifications.",
      reviewingText: "A second review checks the report against the photos: natural or artificial origin, alternatives and confidence.",
    },
  },
});
