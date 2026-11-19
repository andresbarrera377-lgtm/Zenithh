import { defineMessages } from "../define";

export const history = defineMessages<{
  meta: { title: string; description: string; entry: string };
  page: { eyebrow: string; title: string; lead: (limit: number) => string };
  tabs: { collection: string; history: string; label: string };
  empty: { title: string; text: string; cta: string };
  error: { title: string; text: string };
  item: { photos: (n: number) => string; inCollection: string; open: string };
  actions: {
    reanalyze: string;
    save: string;
    saved: string;
    remove: string;
    removeConfirm: string;
    clear: string;
    clearConfirm: string;
    confirm: string;
    cancel: string;
    saveError: string;
  };
  storage: (used: string) => string;
  detail: { back: string; notFoundTitle: string; notFoundText: string; analyzed: (date: string) => string };
  session: { saved: string; view: string };
}>({
  es: {
    meta: { title: "Historial", description: "Todos tus escaneos con sus fotos, guardados en este dispositivo.", entry: "Escaneo" },
    page: {
      eyebrow: "Tus escaneos",
      title: "Historial",
      lead: (limit) => `Cada análisis se guarda aquí automáticamente con sus fotos y el informe completo (los últimos ${limit}), solo en este dispositivo.`,
    },
    tabs: { collection: "Mi colección", history: "Historial", label: "Colección e historial" },
    empty: {
      title: "Aún no hay escaneos",
      text: "Cuando analices una roca aparecerá aquí, con sus fotos y su informe, aunque no la guardes en tu colección.",
      cta: "Escanear una roca",
    },
    error: { title: "No se pudo abrir el historial", text: "El almacenamiento del navegador no está disponible (por ejemplo, en modo privado)." },
    item: { photos: (n) => (n === 1 ? "1 foto" : `${n} fotos`), inCollection: "En tu colección", open: "Ver informe" },
    actions: {
      reanalyze: "Analizar de nuevo con más datos",
      save: "Guardar en mi colección",
      saved: "Ver en mi colección",
      remove: "Borrar",
      removeConfirm: "¿Borrar este escaneo del historial?",
      clear: "Borrar historial",
      clearConfirm: "¿Borrar todo el historial? Tu colección no se toca.",
      confirm: "Sí, borrar",
      cancel: "Cancelar",
      saveError: "No se pudo guardar en tu colección.",
    },
    storage: (used) => `Espacio usado en este dispositivo: ${used}`,
    detail: {
      back: "Historial",
      notFoundTitle: "Escaneo no encontrado",
      notFoundText: "Puede que se haya borrado o que se guardara en otro navegador.",
      analyzed: (date) => `Analizado el ${date}`,
    },
    session: { saved: "Guardado automáticamente en tu historial.", view: "Ver historial" },
  },
  en: {
    meta: { title: "History", description: "All your scans with their photos, saved on this device.", entry: "Scan" },
    page: {
      eyebrow: "Your scans",
      title: "History",
      lead: (limit) => `Every analysis is saved here automatically with its photos and full report (the latest ${limit}), only on this device.`,
    },
    tabs: { collection: "My Collection", history: "History", label: "Collection and history" },
    empty: {
      title: "No scans yet",
      text: "When you analyze a rock it appears here, with its photos and report, even if you don't save it to your collection.",
      cta: "Scan a rock",
    },
    error: { title: "Could not open the history", text: "Browser storage isn't available (for example in private mode)." },
    item: { photos: (n) => (n === 1 ? "1 photo" : `${n} photos`), inCollection: "In your collection", open: "View report" },
    actions: {
      reanalyze: "Analyze again with more data",
      save: "Save to my collection",
      saved: "View in my collection",
      remove: "Delete",
      removeConfirm: "Delete this scan from the history?",
      clear: "Clear history",
      clearConfirm: "Clear the whole history? Your collection is not affected.",
      confirm: "Yes, delete",
      cancel: "Cancel",
      saveError: "Could not save to your collection.",
    },
    storage: (used) => `Space used on this device: ${used}`,
    detail: {
      back: "History",
      notFoundTitle: "Scan not found",
      notFoundText: "It may have been deleted, or saved in another browser.",
      analyzed: (date) => `Analyzed on ${date}`,
    },
    session: { saved: "Saved automatically to your history.", view: "View history" },
  },
});
