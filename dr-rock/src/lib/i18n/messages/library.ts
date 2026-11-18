import { defineMessages } from "../define";

export const library = defineMessages({
  es: {
    meta: {
      title: "Biblioteca de rocas",
      description: "Una enciclopedia interactiva de rocas, fósiles, minerales y tiempo geológico.",
      entryTitle: (name: string) => `${name} · Biblioteca de rocas`,
      notFound: "No encontrado",
    },
    page: {
      eyebrow: "Enciclopedia",
      title: "Biblioteca de rocas",
      lead: (n: number) =>
        `Explora ${n} fichas ilustradas: rocas ígneas, sedimentarias y metamórficas, fósiles marinos y terrestres, minerales, y los periodos y eras del tiempo profundo.`,
    },
    browser: {
      searchLabel: "Buscar en la biblioteca",
      searchPlaceholder: "Busca rocas, fósiles, minerales, periodos…",
      clear: "Borrar búsqueda",
      filterLabel: "Filtrar por categoría",
      all: "Todo",
      noMatches: "Sin resultados",
      noMatchesText: (q: string) => `Nada en la biblioteca coincide con «${q}». Prueba otra palabra, como «volcánica», «Jurásico» o «concha».`,
      viewAll: (n: number) => `Ver ${n}`,
      results: (n: number) => `${n} ${n === 1 ? "resultado" : "resultados"}`,
      inCategory: (plural: string) => ` en ${plural.toLowerCase()}`,
    },
    card: {
      illustration: (name: string) => `Ilustración de ${name}`,
    },
    entry: {
      back: "Biblioteca de rocas",
      description: "Descripción",
      age: "Antigüedad",
      howItForms: "Cómo se forma",
      worldAtTheTime: "El mundo en esa época",
      didYouKnow: "¿Sabías que…?",
      related: "Fichas relacionadas",
      ctaTitle: "¿Encontraste algo parecido?",
      ctaText: "Fotografíalo y deja que Dr.Rock analice sus rasgos.",
      ctaButton: "Analizar una roca",
    },
  },
  en: {
    meta: {
      title: "Rock Library",
      description: "An interactive encyclopedia of rocks, fossils, minerals and geological time.",
      entryTitle: (name: string) => `${name} · Rock Library`,
      notFound: "Not found",
    },
    page: {
      eyebrow: "Encyclopedia",
      title: "Rock Library",
      lead: (n: number) =>
        `Explore ${n} illustrated entries: igneous, sedimentary and metamorphic rocks, marine and terrestrial fossils, minerals, and the periods and eras of deep time.`,
    },
    browser: {
      searchLabel: "Search the Rock Library",
      searchPlaceholder: "Search rocks, fossils, minerals, periods…",
      clear: "Clear search",
      filterLabel: "Filter by category",
      all: "All",
      noMatches: "No matches",
      noMatchesText: (q: string) => `Nothing in the library matches “${q}”. Try another word, like “volcanic”, “Jurassic” or “shell”.`,
      viewAll: (n: number) => `View ${n}`,
      results: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
      inCategory: (plural: string) => ` in ${plural.toLowerCase()}`,
    },
    card: {
      illustration: (name: string) => `Illustration of ${name}`,
    },
    entry: {
      back: "Rock Library",
      description: "Description",
      age: "Age",
      howItForms: "How it forms",
      worldAtTheTime: "The world at the time",
      didYouKnow: "Did you know?",
      related: "Related entries",
      ctaTitle: "Found something similar?",
      ctaText: "Photograph it and let Dr.Rock analyze its features.",
      ctaButton: "Scan a rock",
    },
  },
});
