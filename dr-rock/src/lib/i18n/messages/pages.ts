import { defineMessages } from "../define";

export const pages = defineMessages({
  es: {
    notFound: {
      meta: "Página no encontrada",
      code: "Error 404",
      title: "Esta página se salió del mapa",
      text: "La página que buscabas no existe o se ha movido.",
      openApp: "Abrir la app",
      library: "Biblioteca de rocas",
    },
    offline: {
      meta: "Sin conexión",
      title: "Estás sin conexión",
      text: "Esta página aún no está disponible sin conexión. Tu colección guardada y las páginas que ya visitaste siguen funcionando. El análisis de rocas necesita conexión a internet.",
      collection: "Mi colección",
      library: "Biblioteca de rocas",
    },
  },
  en: {
    notFound: {
      meta: "Not found",
      code: "Error 404",
      title: "This page is off the map",
      text: "The page you were looking for doesn't exist or has moved.",
      openApp: "Open the app",
      library: "Rock Library",
    },
    offline: {
      meta: "Offline",
      title: "You're offline",
      text: "This page isn't available offline yet. Your saved collection and the pages you've visited still work. Rock analysis needs an internet connection.",
      collection: "My Collection",
      library: "Rock Library",
    },
  },
});
