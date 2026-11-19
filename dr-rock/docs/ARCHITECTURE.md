# Arquitectura de Dr.Rock

## 1. Visión general

```
 Navegador (PWA)                                    Servidor (Next.js)                 Anthropic
┌────────────────────────────────────┐            ┌───────────────────────────┐      ┌──────────────┐
│ Scan: cámara / subida              │            │ POST /api/analyze         │      │ Claude       │
│  └ process-image: orienta, reduce, │  multipart │  ├ rate limit             │ HTTPS│ (multimodal) │
│    re-codifica JPEG, quita EXIF ───┼───────────►│  ├ valida bytes reales,   ├─────►│ structured   │
│                                    │            │  │ tamaño y dimensiones   │      │ outputs JSON │
│ Analysis: animación de escaneo     │            │  ├ analyzeRock (SDK)      │◄─────┤              │
│ Results: resumen + informe A–G ◄───┼────────────┤  ├ valida con Zod         │      └──────────────┘
│ My Collection (IndexedDB)          │   JSON     │  └ normalize: reglas      │
│ Rock Library (estática)            │            │    científicas            │
│ Service worker (offline)           │            │ GET /api/health           │
└────────────────────────────────────┘            └───────────────────────────┘
```

- **Una sola app Next.js** sirve la landing (`/`), la aplicación (`/app/*`) y el backend (`/api/*`).
- La **clave de la API** solo existe en el servidor (`ANTHROPIC_API_KEY`). Los módulos de `src/lib/ai/*` importan `server-only`, así que el build falla si se importan desde el cliente por error.
- La **Rock Library** es contenido estático: las páginas se generan en el build y sus ilustraciones son SVG pre-generados.
- **My Collection** es *local-first* (IndexedDB) y está detrás de una interfaz de repositorio, para poder añadir después cuentas y sincronización en la nube.

## 2. Tecnologías

| Área | Elección | Motivo |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) + React 19 | Front y backend seguro en un solo proyecto; páginas estáticas y rutas de API. |
| Lenguaje | TypeScript estricto | Un único contrato tipado entre la IA, la API y la interfaz. |
| Estilos | Tailwind CSS v4 (tokens en `globals.css`) | Sistema de diseño consistente; *container queries* para componentes que se adaptan a su contenedor. |
| IA | Anthropic SDK + Claude multimodal (`claude-opus-5-5` por defecto) con *structured outputs* | La visión y el razonamiento científico del modelo, con respuestas JSON garantizadas por el esquema. |
| Validación | Zod | El mismo esquema genera el JSON Schema que se envía al modelo y valida la respuesta. |
| Almacenamiento | IndexedDB (wrapper propio) | Guarda las fotos como Blob en el dispositivo, sin servidor y funciona offline. |
| Base de datos futura | Prisma + PostgreSQL (`prisma/schema.prisma`) | Preparada para usuarios y descubrimientos sincronizados. |
| PWA | `app/manifest.ts` + `public/sw.js` propio | Instalable; offline para el *shell*, la biblioteca y la colección. |
| Pruebas | Vitest | Pruebas unitarias e integración de la ruta de análisis con un stub de la API. |
| Iconos y fuentes | lucide-react, Fontsource (Inter, Space Grotesk, JetBrains Mono) | Fuentes auto-alojadas, sin dependencias externas en tiempo de ejecución. |

## 3. Cómo funciona el análisis de imágenes

1. **Captura** (`components/scan/*`): hasta 3 fotos guiadas del mismo ejemplar (vista general, primer plano, otra cara o escala). Cámara en vivo con `getUserMedia` (cámara trasera a 4K ideal, linterna, zoom y toque para enfocar con `pointsOfInterest` si el dispositivo lo admite) que toma la foto con `ImageCapture.takePhoto()` a resolución completa cuando existe (si no, un fotograma del vídeo) y se queda abierta para la siguiente foto; `<input capture>` como alternativa; también subida de varias imágenes y arrastrar y soltar.
2. **Preparación en el cliente** (`lib/image/process-image.ts`, `lib/image/quality.ts`): decodifica la imagen (respetando la orientación EXIF), comprueba un mínimo de 200 px y la ajusta a **2576 px** (la resolución máxima que lee el modelo) con la mejor calidad JPEG que cabe en ~1,35 MB (si no cabe, 2048 o 1600 px). Al re-codificar se **eliminan los metadatos**, incluido el GPS. Un control de calidad en el propio dispositivo mide el enfoque (varianza del laplaciano en las zonas más nítidas, para no penalizar rocas lisas), la exposición (por las luces y el recorte, no por la media, para no penalizar rocas negras o blancas), el contraste y la resolución, y avisa sin bloquear. Si la foto original supera 3000 px, también se prepara un recorte del centro a resolución completa. Miniatura de 480 px para la colección y el historial.
3. **Envío** (`lib/analysis/client.ts`, `lib/scan/session.tsx`): `multipart/form-data` con las fotos (campos `image` repetidos y `photoRoles`), el recorte automático si cabe en el presupuesto de 3 imágenes y ~4,3 MB (`lib/analysis/photos.ts`, por el límite de ~6 MB por petición de Netlify), las notas de campo y las **pruebas de campo** estructuradas (vinagre, dureza, imán, peso, raya). Tiene timeout (8 min), cancelación, detecta cuando no hay conexión y muestra en qué pasada está el análisis.
4. **Validación en el servidor** (`app/api/analyze/route.ts`, `lib/server/*`):
   - rate limit por IP (ventana deslizante en memoria);
   - de 1 a 3 imágenes, cada una de 3,5 MB como máximo (límite de 5 MB por imagen de la API) y ~4,3 MB en total;
   - formato real detectado por *magic bytes* (JPEG, PNG, WebP, GIF), sin fiarse del MIME declarado;
   - dimensiones leídas de la cabecera (entre 200 y 8000 px);
   - notas y pruebas validadas con Zod (valores permitidos y longitudes máximas).
5. **Llamada al modelo, en dos pasadas** (`lib/ai/analyze-core.ts`): `messages.create` con razonamiento adaptativo y `effort` configurable (alto por defecto). Cada foto va precedida de una etiqueta ("Photo 2 of 3 — close-up…") y la última lleva un punto de caché, de modo que la segunda pasada lee el *system prompt* y las fotos de la caché.
   - *System prompt* científico (`lib/ai/prompt.ts`): evidencia primero y diagnóstico diferencial; **¿natural o hecho por personas?** (hormigón, ladrillo, cerámica, vidrio, escoria, resina, cristales de laboratorio; piedras cortadas, pulidas, teñidas, talladas o reconstruidas, herramientas de piedra y fósiles falsos o restaurados; y cosas naturales que parecen artificiales); pseudofósiles; veredictos definidos; confianza calibrada; uso combinado de varias fotos; interpretación de las pruebas de campo; edades solo como rangos; fósiles solo en la corteza; y notas del usuario tratadas como datos, no como instrucciones. El esquema JSON del informe (`lib/analysis/wire.ts`) va en el prompt y la respuesta se valida con Zod.
   - **Pasada 1 (análisis)**: el modelo redacta el informe completo.
   - **Pasada 2 (verificación)**: con las mismas fotos y el borrador, revisa origen, identificación y alternativas, veredicto de fósil (pseudofósiles, réplicas, restauraciones), confianza y datos, y devuelve el informe corregido. Si la revisión falla o devuelve algo inválido se usa el primer informe. Se desactiva con `DR_ROCK_REVIEW=off`; sin modo trabajo, solo se hace si la primera pasada tardó menos de 110 s.
   - En Netlify el análisis corre en una función de fondo (`netlify/functions/analyze-background.mts`), que va anotando la pasada en el trabajo para que la app la muestre.
   - *Server-side fallback* (`fallbacks: "default"`) cuando el entorno admite cabeceras beta.
6. **Comprobaciones posteriores** (`lib/analysis/normalize.ts`), que se aplican aunque el modelo no las cumpla:
   - si la imagen no muestra una roca ni un material parecido o es inutilizable, el veredicto es `insufficient_image`;
   - un objeto **hecho por personas** nunca queda como `probable_fossil` y su clasificación pasa a `artificial`;
   - `probable_fossil` exige una confianza de fósil de al menos 55; si no, pasa a `inconclusive_fossil_like`;
   - los campos de fósil se vacían si el veredicto no indica nada fosilífero;
   - las confianzas se limitan a 0–100, la dureza de Mohs a 1–10 y las edades a 0–4567 Ma (ordenadas), y las listas se recortan.
7. **Historial** (`lib/history/*`, `lib/storage/idb.ts`): cada resultado se guarda automáticamente en IndexedDB (versión 2 de la base de datos, que añade el almacén `history` sin tocar la colección) con sus fotos, el informe, las notas y las pruebas; se conservan los 30 más recientes. Desde el historial se puede guardar en la colección o volver a cargar las fotos en el escáner para añadir más datos y analizar de nuevo.
8. **Errores honestos**: cada fallo devuelve un código tipado (`AI_NOT_CONFIGURED`, `AI_UNAVAILABLE`, `AI_BUSY`, `AI_REFUSED`, `AI_INVALID_RESPONSE`, `RATE_LIMITED`, `INVALID_IMAGE`, …). La interfaz muestra un mensaje claro y nunca genera un resultado de reemplazo.

## 4. Estructura del proyecto

```
dr-rock/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 Landing page
│  │  ├─ layout.tsx, globals.css  Layout raíz, tokens de diseño
│  │  ├─ manifest.ts, icon.svg    PWA
│  │  ├─ offline/                 Fallback offline del service worker
│  │  ├─ api/analyze/route.ts     Análisis (POST)
│  │  ├─ api/health/route.ts      Estado de la IA (configurada o no)
│  │  └─ app/                     Aplicación: home, scan, analysis, results,
│  │                              library, library/[id], collection, collection/[id], about
│  ├─ components/
│  │  ├─ app-shell/   Navegación (sidebar / tab bar), indicador de estado de la IA
│  │  ├─ scan/        Cámara, panel de escaneo, pantalla de análisis
│  │  ├─ results/     Resumen, informe A–G, escala de tiempo, Mohs, capas de la Tierra
│  │  ├─ library/     Navegador y tarjetas de la enciclopedia
│  │  ├─ collection/  Colección, detalle con notas y etiquetas
│  │  ├─ art/         Ilustraciones procedurales (rocas, fósiles, cristales, estratos)
│  │  ├─ landing/     Secciones de la landing
│  │  ├─ pwa/         Registro del service worker, botón de instalación
│  │  ├─ brand/       Logo y visual del hero
│  │  └─ ui/          Botones y primitivas
│  └─ lib/
│     ├─ analysis/    Esquema (contrato), normalización, presentación, cliente, ejemplo
│     ├─ ai/          Configuración, prompt y llamada al modelo (solo servidor)
│     ├─ server/      Validación de imágenes, rate limit
│     ├─ image/       Preparación de imágenes en el navegador
│     ├─ scan/        Estado de la sesión de escaneo (React context)
│     ├─ collection/  Tipos, repositorio IndexedDB, hooks
│     └─ library/     Datos de la enciclopedia, búsqueda, escala de tiempo ICS
├─ public/           sw.js, iconos, ilustraciones pre-generadas
├─ prisma/           Esquema preparado para la nube (v2)
├─ scripts/          generate-assets.tsx
└─ tests/            Integración de /api/analyze
```

## 5. Hoja de ruta de cuentas y sincronización

La interfaz solo usa `DiscoveryRepository` (`lib/collection/types.ts`), y `getDiscoveryRepository()` (`lib/collection/store.ts`) es el único lugar que elige la implementación. Los registros ya incluyen `ownerId`, `syncState`, `remoteId` y `schemaVersion`.

Pasos previstos:

1. **Autenticación** (p. ej. Auth.js) y base de datos con `prisma/schema.prisma`.
2. **Almacenamiento de imágenes** en un object storage (S3, R2 o Vercel Blob). En la base de datos solo se guardan las claves.
3. **API de sincronización** (`/api/discoveries`) con *upserts* por `(ownerId, localId)` y borrado lógico (`deletedAt`).
4. **`SyncedDiscoveryRepository`**: escribe primero en IndexedDB (sigue funcionando offline), marca `syncState: "pending"` y sincroniza en segundo plano. Las colecciones locales existentes se suben al iniciar sesión.
5. Mover el rate limit a un almacén compartido (Redis o Upstash) cuando haya varias instancias.

## 6. Seguridad y privacidad

- La clave de la API solo está en el servidor. Nunca se expone en el bundle ni en `NEXT_PUBLIC_*`.
- Las imágenes se validan por contenido real, con límites de tamaño y dimensiones.
- Se aplica rate limit y se mapean los errores del proveedor sin filtrar detalles internos.
- Cabeceras de seguridad (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy: camera=(self)`).
- Las notas del usuario se delimitan y se tratan como datos no confiables en el prompt.
- El servidor no guarda las fotos y se eliminan los metadatos de ubicación antes de subirlas. La colección vive en el dispositivo.
