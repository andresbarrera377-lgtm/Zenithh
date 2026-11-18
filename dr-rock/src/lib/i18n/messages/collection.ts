import { defineMessages } from "../define";

export const collection = defineMessages<{
  filters: { all: string; favorites: string; fossils: string; igneous: string; sedimentary: string; metamorphic: string; mineral: string };
  sorts: { newest: string; oldest: string; name: string };
  openError: string;
  openErrorText: string;
  emptyTitle: string;
  emptyText: string;
  scanFirst: string;
  search: string;
  searchPlaceholder: string;
  sort: string;
  tags: string;
  noMatchTitle: string;
  noMatchText: string;
  storedNote: (n: number) => string;
  card: { open: (title: string) => string; removeFavorite: string; addFavorite: string };
  recentEmpty: string;
  viewAll: (n: number) => string;
  detail: {
    openError: string;
    notFoundTitle: string;
    notFoundText: string;
    back: string;
    backLink: string;
    journal: string;
    saved: (date: string) => string;
    saving: string;
    savedOk: string;
    couldNotSave: string;
    favorite: string;
    addFavorite: string;
    name: string;
    tags: string;
    removeTag: (tag: string) => string;
    addTag: string;
    tagPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    confirmDelete: string;
    cancel: string;
    delete: string;
  };
  page: { eyebrow: string; title: string; lead: string };
}>({
  es: {
    filters: { all: "Todas", favorites: "Favoritas", fossils: "Con posible fósil", igneous: "Ígneas", sedimentary: "Sedimentarias", metamorphic: "Metamórficas", mineral: "Minerales" },
    sorts: { newest: "Más recientes", oldest: "Más antiguas", name: "Nombre (A–Z)" },
    openError: "No se pudo abrir tu colección",
    openErrorText: "Los modos de navegación privada pueden bloquear el almacenamiento local.",
    emptyTitle: "Tu colección está vacía",
    emptyText: "Analiza una roca y toca «Guardar análisis» para empezar tu colección personal de descubrimientos.",
    scanFirst: "Escanea tu primera roca",
    search: "Buscar en tu colección",
    searchPlaceholder: "Buscar nombres, notas y etiquetas…",
    sort: "Ordenar",
    tags: "Etiquetas",
    noMatchTitle: "Ningún descubrimiento coincide",
    noMatchText: "Prueba otra búsqueda, filtro o etiqueta.",
    storedNote: (n) => `${n} ${n === 1 ? "descubrimiento guardado" : "descubrimientos guardados"} en privado en este dispositivo. Si borras los datos del navegador, se eliminarán.`,
    card: { open: (t) => `Abrir ${t}`, removeFavorite: "Quitar de favoritas", addFavorite: "Añadir a favoritas" },
    recentEmpty: "Aún no has guardado descubrimientos. Analiza una roca y guarda el informe para empezar tu colección.",
    viewAll: (n) => `Ver los ${n} descubrimientos`,
    detail: {
      openError: "No se pudo abrir este descubrimiento",
      notFoundTitle: "Descubrimiento no encontrado",
      notFoundText: "Puede que se haya borrado o que se guardara en otro navegador o dispositivo.",
      back: "Volver a la colección",
      backLink: "Mi colección",
      journal: "Cuaderno de campo",
      saved: (d) => `Guardado el ${d}`,
      saving: "Guardando…",
      savedOk: "Guardado",
      couldNotSave: "No se pudo guardar",
      favorite: "Favorita",
      addFavorite: "Añadir a favoritas",
      name: "Nombre",
      tags: "Etiquetas",
      removeTag: (t) => `Quitar etiqueta ${t}`,
      addTag: "Añadir etiqueta",
      tagPlaceholder: "p. ej. playa, viaje 2026, amonites",
      notes: "Notas personales",
      notesPlaceholder: "Dónde la encontraste, con quién estabas, pruebas que hiciste…",
      confirmDelete: "¿Borrar este descubrimiento para siempre?",
      cancel: "Cancelar",
      delete: "Borrar",
    },
    page: { eyebrow: "Cuaderno de campo", title: "Mi colección", lead: "Cada ejemplar que guardaste, con su foto, el informe completo, tus notas y etiquetas." },
  },
  en: {
    filters: { all: "All", favorites: "Favourites", fossils: "Fossil-like", igneous: "Igneous", sedimentary: "Sedimentary", metamorphic: "Metamorphic", mineral: "Minerals" },
    sorts: { newest: "Newest first", oldest: "Oldest first", name: "Name (A–Z)" },
    openError: "Your collection could not be opened",
    openErrorText: "Private browsing modes may block local storage.",
    emptyTitle: "Your collection is empty",
    emptyText: "Analyze a rock and tap “Save analysis” to start your personal collection of discoveries.",
    scanFirst: "Scan your first rock",
    search: "Search your collection",
    searchPlaceholder: "Search names, notes and tags…",
    sort: "Sort",
    tags: "Tags",
    noMatchTitle: "No discoveries match",
    noMatchText: "Try a different search, filter or tag.",
    storedNote: (n) => `${n} ${n === 1 ? "discovery" : "discoveries"} stored privately on this device. Clearing your browser data will remove them.`,
    card: { open: (t) => `Open ${t}`, removeFavorite: "Remove from favourites", addFavorite: "Add to favourites" },
    recentEmpty: "No saved discoveries yet. Analyze a rock and save the report to start your collection.",
    viewAll: (n) => `View all ${n} discoveries`,
    detail: {
      openError: "Could not open this discovery",
      notFoundTitle: "Discovery not found",
      notFoundText: "It may have been deleted, or it was saved in a different browser or device.",
      back: "Back to collection",
      backLink: "My Collection",
      journal: "Field journal",
      saved: (d) => `Saved ${d}`,
      saving: "Saving…",
      savedOk: "Saved",
      couldNotSave: "Could not save",
      favorite: "Favourite",
      addFavorite: "Add to favourites",
      name: "Name",
      tags: "Tags",
      removeTag: (t) => `Remove tag ${t}`,
      addTag: "Add tag",
      tagPlaceholder: "e.g. beach, 2026 trip, ammonites",
      notes: "Personal notes",
      notesPlaceholder: "Where you found it, who you were with, tests you tried…",
      confirmDelete: "Delete this discovery permanently?",
      cancel: "Cancel",
      delete: "Delete",
    },
    page: { eyebrow: "Field journal", title: "My Collection", lead: "Every specimen you've saved, with its photo, full report, your notes and tags." },
  },
});
