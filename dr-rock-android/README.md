# Dr.Rock para Android

App nativa de Android (Capacitor 8) que abre la versión publicada de Dr.Rock. Instala un icono propio en el teléfono, se abre a pantalla completa, usa la cámara del dispositivo y muestra una pantalla clara cuando no hay conexión.

## Cómo funciona

El APK **no contiene la IA ni la clave de Anthropic**. Abre la app web publicada (por ejemplo en Vercel), donde el servidor guarda la clave en sus variables de entorno. Así:

- la clave nunca viaja dentro del APK, donde cualquiera podría extraerla;
- cada mejora que publiques en el servidor llega al teléfono sin reinstalar el APK;
- la colección se guarda en el propio teléfono, igual que en el navegador.

## Compilar el APK

Requisitos: Node.js 20+, JDK 21 y el Android SDK (plataforma 36 y build-tools) con `ANDROID_HOME` apuntando a él.

```bash
npm install
# Firma de release (guarda el keystore y la contraseña: las actualizaciones deben firmarse con la misma clave)
export DR_ROCK_KEYSTORE=/ruta/drrock-release.jks
export DR_ROCK_KEYSTORE_PASSWORD=...
export DR_ROCK_KEY_ALIAS=drrock
export DR_ROCK_KEY_PASSWORD=...
node scripts/build-apk.mjs https://tu-dr-rock.vercel.app
```

El APK queda en `dist/Dr.Rock.apk`. La dirección se guarda en `capacitor.config.json`, así que las siguientes compilaciones no necesitan repetirla. Sin variables de firma se genera `dist/Dr.Rock-debug.apk`, firmado en modo depuración, solo para pruebas.

Para crear un keystore nuevo:

```bash
keytool -genkeypair -keystore drrock-release.jks -alias drrock -keyalg RSA -keysize 4096 -validity 10000
```

Nunca subas el keystore ni sus contraseñas al repositorio (`.gitignore` ya los excluye).

## Iconos

Se generan desde la misma geometría del logo que usa la app web:

```bash
../dr-rock/node_modules/.bin/tsx scripts/icon-sources.ts
npx capacitor-assets generate --android --iconBackgroundColor '#0b0e0d' --iconBackgroundColorDark '#0b0e0d' --splashBackgroundColor '#0b0e0d' --splashBackgroundColorDark '#0b0e0d'
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `capacitor.config.json` | Nombre, id (`com.zenithh.drrock`), dirección del servidor y barras del sistema |
| `www/offline.html` | Pantalla que aparece si no se puede cargar la app (sin conexión o error del servidor) |
| `android/` | Proyecto nativo; permiso de cámara en `app/src/main/AndroidManifest.xml` |
| `scripts/build-apk.mjs` | Compila y firma el APK |
| `scripts/icon-sources.ts` | Genera las imágenes de origen del icono y de la pantalla de inicio |
