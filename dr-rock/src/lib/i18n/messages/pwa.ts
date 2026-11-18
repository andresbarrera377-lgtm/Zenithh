import { defineMessages } from "../define";

type Step = { title: string; text: string };

export const pwa = defineMessages<{
  install: string;
  installed: string;
  ios: {
    button: string;
    eyebrow: string;
    title: string;
    steps: [Step, { title: string; before: string; after: string }, Step, Step];
    note: string;
    share: string;
  };
  hint: { iosTitle: string; iosText: string; iosAction: string; androidTitle: string; androidText: (size: string) => string; downloadApk: string; hide: string };
}>({
  es: {
    install: "Instalar Dr.Rock",
    installed: "Dr.Rock está instalada en este dispositivo.",
    ios: {
      button: "Instalar en iPhone",
      eyebrow: "iPhone y iPad",
      title: "Instala Dr.Rock en 4 pasos",
      steps: [
        { title: "Abre Dr.Rock en Safari", text: "Entra en dr-rock.netlify.app con Safari (en iOS recientes también funciona con Chrome)." },
        {
          title: "Toca el botón Compartir",
          before: "Es el cuadrado con una flecha hacia arriba",
          after: ". En iOS 26 está en el menú de los tres puntos «···», a la derecha de la barra de direcciones; en versiones anteriores, en la barra de abajo (arriba en iPad).",
        },
        { title: "Elige «Añadir a pantalla de inicio»", text: "Baja por la lista si no lo ves. Deja activado «Abrir como app web»." },
        { title: "Toca «Añadir»", text: "Dr.Rock aparece en tu pantalla de inicio y se abre a pantalla completa, como cualquier app." },
      ],
      note: "Sin App Store. Tu colección se queda en tu dispositivo; analizar una roca necesita conexión a internet.",
      share: "Compartir",
    },
    hint: {
      iosTitle: "Pon Dr.Rock en tu pantalla de inicio",
      iosText: "Con su icono, a pantalla completa y con pantalla de inicio, sin App Store.",
      iosAction: "Ver cómo",
      androidTitle: "Descarga la app de Dr.Rock para Android",
      androidText: (size) => `Instala la app (${size}) para tener la cámara a un toque.`,
      downloadApk: "Descargar APK",
      hide: "Ocultar esta sugerencia",
    },
  },
  en: {
    install: "Install Dr.Rock",
    installed: "Dr.Rock is installed on this device.",
    ios: {
      button: "Install on iPhone",
      eyebrow: "iPhone & iPad",
      title: "Install Dr.Rock in 4 steps",
      steps: [
        { title: "Open Dr.Rock in Safari", text: "Go to dr-rock.netlify.app in Safari (recent iOS versions also allow Chrome)." },
        {
          title: "Tap the Share button",
          before: "The square with an arrow pointing up",
          after: ". On iOS 26 it is in the “···” menu at the right of the address bar; on earlier versions, in the bottom toolbar (top on iPad).",
        },
        { title: "Choose “Add to Home Screen”", text: "Scroll down the list if you don't see it. Keep “Open as Web App” on." },
        { title: "Tap “Add”", text: "Dr.Rock appears on your Home Screen and opens full screen, like any app." },
      ],
      note: "No App Store needed. Your collection stays on your device; analyzing a rock needs an internet connection.",
      share: "Share",
    },
    hint: {
      iosTitle: "Put Dr.Rock on your Home Screen",
      iosText: "Its own icon, full screen and a launch screen — no App Store needed.",
      iosAction: "Show me how",
      androidTitle: "Get the Dr.Rock app for Android",
      androidText: (size) => `Install the app (${size}) for quick access to the camera.`,
      downloadApk: "Download APK",
      hide: "Hide this suggestion",
    },
  },
});
