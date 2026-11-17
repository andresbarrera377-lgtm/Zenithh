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

1. **Captura** (`components/scan/*`): cámara en vivo con `getUserMedia` (cámara trasera, linterna y cambio de cámara si el dispositivo lo admite) o `<input capture>` como alternativa; también subida y arrastrar y soltar.
2. **Preparación en el cliente** (`lib/image/process-image.ts`): decodifica la imagen (respetando la orientación EXIF), comprueba un mínimo de 200 px, la reduce a 1600 px como máximo y la re-codifica en JPEG de 2,5 MB como máximo. Al re-codificar se **eliminan los metadatos**, incluido el GPS. También genera una miniatura de 480 px para la colección.
3. **Envío** (`lib/analysis/client.ts`): `multipart/form-data` con la imagen y notas de campo opcionales (lugar, tamaño, observaciones). Tiene timeout, cancelación y detecta cuando no hay conexión.
4. **Validación en el servidor** (`app/api/analyze/route.ts`, `lib/server/*`):
   - rate limit por IP (ventana deslizante en memoria);
   - límite de tamaño (3,5 MB, por debajo del límite de 5 MB por imagen de la API);
   - formato real detectado por *magic bytes* (JPEG, PNG, WebP, GIF), sin fiarse del MIME declarado;
   - dimensiones leídas de la cabecera (entre 200 y 8000 px);
   - notas validadas con Zod (longitudes máximas).
5. **Llamada al modelo** (`lib/ai/analyze-rock.ts`): `client.beta.messages.parse` con:
   - el *system prompt* científico (`lib/ai/prompt.ts`), que aplica estas reglas: evidencia primero, considerar pseudofósiles, veredictos definidos, confianza calibrada, edades solo como rangos, fósiles solo en la corteza, y tratar las notas del usuario como datos y no como instrucciones;
   - `output_config.format` = JSON Schema generado desde `RockAnalysisSchema` (las descripciones de los campos actúan como instrucciones);
   - razonamiento adaptativo y `effort` configurable;
   - *server-side fallback* (`fallbacks: "default"`), que reintenta en el modelo recomendado si el principal declina por políticas.
6. **Comprobaciones posteriores** (`lib/analysis/normalize.ts`), que se aplican aunque el modelo no las cumpla:
   - si la imagen no muestra una roca o es inutilizable, el veredicto es `insufficient_image`;
   - `probable_fossil` exige una confianza de fósil de al menos 55; si no, pasa a `inconclusive_fossil_like`;
   - los campos de fósil se vacían si el veredicto no indica nada fosilífero;
   - las confianzas se limitan a 0–100, la dureza de Mohs a 1–10 y las edades a 0–4567 Ma (ordenadas), y las listas se recortan.
7. **Errores honestos**: cada fallo devuelve un código tipado (`AI_NOT_CONFIGURED`, `AI_UNAVAILABLE`, `AI_BUSY`, `AI_REFUSED`, `AI_INVALID_RESPONSE`, `RATE_LIMITED`, `INVALID_IMAGE`, …). La interfaz muestra un mensaje claro y nunca genera un resultado de reemplazo.

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
