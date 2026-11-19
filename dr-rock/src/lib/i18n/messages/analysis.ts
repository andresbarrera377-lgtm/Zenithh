import type { AnalysisErrorCode } from "../../analysis/schema";
import { defineMessages } from "../define";

type ErrorText = Record<AnalysisErrorCode, { title: string; message: string }>;

export const analysis = defineMessages<{
  scanMessages: string[];
  errors: ErrorText;
  failed: string;
  noResultNote: string;
  retryIn: (minutes: number) => string;
  tryAgain: string;
  backToScan: string;
  emptyTitle: string;
  emptyText: string;
  scanRock: string;
  cancelledTitle: string;
  cancelledText: string;
  analyzeAgain: string;
  specimen: string;
  specimenAnalyzing: string;
  inProgress: string;
  elapsed: (time: string) => string;
  cancel: string;
  hudTitle: string;
  hudProcessing: string;
}>({
  es: {
    scanMessages: [
      "Examinando estructuras minerales…",
      "Buscando patrones fósiles…",
      "Analizando características geológicas…",
      "Midiendo el tamaño de grano y la textura…",
      "Comparando con tipos de roca conocidos…",
      "Estimando el rango de edad geológica…",
      "Redactando el informe científico…",
    ],
    errors: {
      AI_NOT_CONFIGURED: { title: "Análisis con IA no disponible", message: "El servicio de análisis con IA no está configurado en este servidor. No se generó ninguna identificación." },
      AI_UNAVAILABLE: { title: "Servicio de IA inaccesible", message: "No se pudo contactar con el servicio de IA. Inténtalo de nuevo en un momento." },
      AI_BUSY: { title: "Servicio de IA ocupado", message: "El servicio de IA está muy solicitado ahora mismo. Espera un poco e inténtalo de nuevo." },
      AI_REFUSED: { title: "Imagen no analizada", message: "La IA no quiso analizar esta imagen. Prueba con otra foto del ejemplar." },
      AI_INVALID_RESPONSE: { title: "Respuesta de la IA incompleta", message: "La IA devolvió un informe con un formato inesperado. Inténtalo de nuevo." },
      AI_REQUEST_REJECTED: { title: "No se pudo procesar la imagen", message: "El servicio de IA no pudo procesar esta imagen. Prueba con otra foto en JPG o PNG." },
      INVALID_REQUEST: { title: "Solicitud no válida", message: "La solicitud no era válida. Vuelve a elegir la foto e inténtalo de nuevo." },
      INVALID_IMAGE: { title: "Imagen no válida", message: "La imagen no es válida o es demasiado pequeña. Usa una foto de al menos 200 px por lado." },
      UNSUPPORTED_IMAGE_TYPE: { title: "Imagen no compatible", message: "Este tipo de imagen no es compatible. Usa una foto JPG, PNG, WebP o GIF." },
      IMAGE_TOO_LARGE: { title: "Imagen demasiado grande", message: "La imagen es demasiado grande. Usa una foto de menos de 3,5 MB." },
      RATE_LIMITED: { title: "Demasiados análisis", message: "Has alcanzado el límite de análisis por ahora. Espera unos minutos e inténtalo de nuevo." },
      TIMEOUT: { title: "El análisis tardó demasiado", message: "El análisis tardó demasiado. Inténtalo de nuevo." },
      NETWORK_ERROR: { title: "Problema de conexión", message: "No se pudo contactar con el servidor de Dr.Rock. Revisa tu conexión e inténtalo de nuevo." },
      OFFLINE: { title: "Estás sin conexión", message: "Parece que no tienes conexión. Conéctate a internet para analizar una roca." },
      UNKNOWN: { title: "El análisis falló", message: "Algo salió mal durante el análisis. Inténtalo de nuevo." },
    },
    failed: "El análisis falló",
    noResultNote: "No se generó ninguna identificación: Dr.Rock nunca muestra resultados que la IA no haya producido.",
    retryIn: (m) => ` Vuelve a intentarlo en unos ${m} min.`,
    tryAgain: "Reintentar",
    backToScan: "Volver a escanear",
    emptyTitle: "No hay ejemplar que analizar",
    emptyText: "Primero haz o sube una foto de una roca.",
    scanRock: "Escanear una roca",
    cancelledTitle: "Análisis cancelado",
    cancelledText: "Tu foto sigue preparada. Puedes analizarla de nuevo o elegir otra.",
    analyzeAgain: "Analizar de nuevo",
    specimen: "Ejemplar",
    specimenAnalyzing: "Ejemplar en análisis",
    inProgress: "Análisis en curso",
    elapsed: (time) => `${time} transcurrido · suele tardar 1–3 min`,
    cancel: "Cancelar",
    hudTitle: "DR.ROCK · ANÁLISIS VISUAL",
    hudProcessing: "PROCESANDO",
  },
  en: {
    scanMessages: [
      "Examining mineral structures…",
      "Searching for fossil patterns…",
      "Analyzing geological characteristics…",
      "Measuring grain size and texture…",
      "Comparing with known rock types…",
      "Estimating geological age range…",
      "Compiling scientific report…",
    ],
    errors: {
      AI_NOT_CONFIGURED: { title: "AI analysis unavailable", message: "The AI analysis service is not configured on this server. No identification was generated." },
      AI_UNAVAILABLE: { title: "AI service unreachable", message: "Could not reach the AI service. Please try again in a moment." },
      AI_BUSY: { title: "AI service busy", message: "The AI service is busy right now. Please wait a little and try again." },
      AI_REFUSED: { title: "Image not analyzed", message: "The AI declined to analyze this image. Please try a different photo of the specimen." },
      AI_INVALID_RESPONSE: { title: "Incomplete AI response", message: "The AI returned a report in an unexpected format. Please try again." },
      AI_REQUEST_REJECTED: { title: "Image could not be processed", message: "The AI service could not process this image. Try another photo in JPG or PNG format." },
      INVALID_REQUEST: { title: "Invalid request", message: "The request was not valid. Choose the photo again and retry." },
      INVALID_IMAGE: { title: "Invalid image", message: "The image is invalid or too small. Use a photo at least 200px on each side." },
      UNSUPPORTED_IMAGE_TYPE: { title: "Unsupported image", message: "This image type is not supported. Use a JPG, PNG, WebP or GIF photo." },
      IMAGE_TOO_LARGE: { title: "Image too large", message: "The image is too large. Please use a photo under 3.5 MB." },
      RATE_LIMITED: { title: "Too many analyses", message: "You have reached the analysis limit for now. Please wait a few minutes and try again." },
      TIMEOUT: { title: "Analysis timed out", message: "The analysis took too long. Please try again." },
      NETWORK_ERROR: { title: "Connection problem", message: "Could not reach the Dr.Rock server. Check your connection and try again." },
      OFFLINE: { title: "You're offline", message: "You appear to be offline. Connect to the internet to analyze a rock." },
      UNKNOWN: { title: "Analysis failed", message: "Something went wrong during the analysis. Please try again." },
    },
    failed: "Analysis failed",
    noResultNote: "No identification was generated — Dr.Rock never shows results the AI did not produce.",
    retryIn: (m) => ` Try again in about ${m} min.`,
    tryAgain: "Try again",
    backToScan: "Back to scan",
    emptyTitle: "No specimen to analyze",
    emptyText: "Take or upload a photo of a rock first.",
    scanRock: "Scan a rock",
    cancelledTitle: "Analysis cancelled",
    cancelledText: "Your photo is still ready. You can analyze it again or choose a different one.",
    analyzeAgain: "Analyze again",
    specimen: "Specimen",
    specimenAnalyzing: "Specimen being analyzed",
    inProgress: "Analysis in progress",
    elapsed: (time) => `${time} elapsed · usually 1–3 min`,
    cancel: "Cancel",
    hudTitle: "DR.ROCK · VISUAL ANALYSIS",
    hudProcessing: "PROCESSING",
  },
});
