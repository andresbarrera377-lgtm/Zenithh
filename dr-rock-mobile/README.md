# Dr.Rock para Android e iOS

Apps nativas de Android e iOS (Capacitor 8) que abren la versión publicada de Dr.Rock. Instalan un icono propio en el teléfono, se abren a pantalla completa, usan la cámara del dispositivo y muestran una pantalla clara cuando no hay conexión.

## Cómo funciona

Las apps **no contienen la IA ni la clave de Anthropic**. Abre la app web publicada (por ejemplo en Vercel), donde el servidor guarda la clave en sus variables de entorno. Así:

- la clave nunca viaja dentro de la app, donde cualquiera podría extraerla;
- cada mejora que publiques en el servidor llega al teléfono sin reinstalar la app;
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

El APK queda en `dist/Dr.Rock.apk`. Para publicarlo en la web (botón "Download APK" de la landing), cópialo a `../dr-rock/public/downloads/Dr.Rock.apk`, actualiza `androidApk` en `../dr-rock/src/lib/site.ts` si cambian la versión o el tamaño (una prueba lo comprueba) y vuelve a desplegar. La dirección se guarda en `capacitor.config.json`, así que las siguientes compilaciones no necesitan repetirla. Sin variables de firma se genera `dist/Dr.Rock-debug.apk`, firmado en modo depuración, solo para pruebas.

Para crear un keystore nuevo:

```bash
keytool -genkeypair -keystore drrock-release.jks -alias drrock -keyalg RSA -keysize 4096 -validity 10000
```

Nunca subas el keystore ni sus contraseñas al repositorio (`.gitignore` ya los excluye).

## iOS (iPhone y iPad)

El proyecto de Xcode está en `ios/` (generado con Capacitor, Swift Package Manager, sin CocoaPods), con el mismo nombre, icono, pantalla de inicio, permiso de cámara (`NSCameraUsageDescription`) y dirección del servidor que la app de Android.

Apple solo permite instalar apps desde la App Store (o TestFlight para pruebas), así que para publicarla necesitas:

- una Mac con Xcode;
- una cuenta del Apple Developer Program (99 USD al año).

Pasos:

```bash
npm install
npx cap sync ios
npx cap open ios        # abre el proyecto en Xcode
```

En Xcode: *Signing & Capabilities* → elige tu equipo (Team) → *Product › Archive* → *Distribute App* → App Store Connect (TestFlight o revisión para la App Store). Con un Apple ID gratuito también puedes instalarla en tu propio iPhone desde Xcode, pero caduca a los 7 días.

**Ojo con la revisión de Apple:** la guía 4.2 (funcionalidad mínima) rechaza a menudo las apps que solo muestran una web. Si la rechazan, la vía habitual es incluir la interfaz dentro de la app y usar funciones nativas (cámara, archivos) en lugar de cargar la web remota.

Mientras tanto, en iPhone Dr.Rock se instala desde Safari como app web (botón *Install on iPhone* de la landing): icono propio, pantalla completa y pantalla de inicio.

## Iconos

Se generan desde la misma geometría del logo que usa la app web:

```bash
../dr-rock/node_modules/.bin/tsx scripts/icon-sources.ts
npx capacitor-assets generate --android --ios --iconBackgroundColor '#0b0e0d' --iconBackgroundColorDark '#0b0e0d' --splashBackgroundColor '#0b0e0d' --splashBackgroundColorDark '#0b0e0d'
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `capacitor.config.json` | Nombre, id (`com.zenithh.drrock`), dirección del servidor y barras del sistema |
| `www/offline.html` | Pantalla que aparece si no se puede cargar la app (sin conexión o error del servidor) |
| `android/` | Proyecto nativo de Android; permiso de cámara en `app/src/main/AndroidManifest.xml` |
| `ios/` | Proyecto nativo de iOS (Xcode); permisos en `App/App/Info.plist` |
| `scripts/build-apk.mjs` | Compila y firma el APK |
| `scripts/icon-sources.ts` | Genera las imágenes de origen del icono y de la pantalla de inicio |
