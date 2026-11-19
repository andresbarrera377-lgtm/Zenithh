/**
 * Client-side image preparation.
 *
 * Every photo — camera capture or upload — is decoded, rotated according to its EXIF
 * orientation, downscaled and re-encoded as JPEG before it leaves the device. This:
 * - sends the AI as much detail as it can use (Claude reads up to 2576 px on the long edge)
 *   while keeping each photo inside the upload budget (see lib/analysis/photos.ts),
 * - strips EXIF metadata (including GPS location) for privacy.
 */

import { PHOTO_TARGET_BYTES } from "../analysis/photos";
import { assessCanvas, type PhotoQuality } from "./quality";

export const ACCEPTED_IMAGE_INPUT = "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif";
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;
export const MIN_DIMENSION = 200;

/** Sizes tried in order: the AI's full resolution first, smaller only if the budget requires it. */
const ANALYSIS_EDGES = [2576, 2048, 1600];
const JPEG_QUALITIES = [0.9, 0.85, 0.8, 0.74, 0.68];
const THUMBNAIL_MAX_EDGE = 480;

export interface ProcessedImage {
  blob: Blob;
  thumbnail: Blob;
  width: number;
  height: number;
  /** On-device sharpness / exposure check (see quality.ts). */
  quality: PhotoQuality;
  /**
   * Full-resolution crop of the centre of the photo, made only when the original has more pixels
   * than the AI reads (long edge > 3000 px), so the AI also sees the finest texture.
   */
  detail?: Blob;
}

export type ImageErrorCode =
  | "noCanvas"
  | "encode"
  | "tooHeavy"
  | "empty"
  | "tooSmall"
  | "notImage"
  | "tooLarge"
  | "heic"
  | "unreadable"
  | "cameraNotReady";

/** Image problem the user can act on; `code` selects the translated message in the UI. */
export class ImageProcessingError extends Error {
  constructor(
    public readonly code: ImageErrorCode,
    public readonly params: { width?: number; height?: number; min?: number } = {},
  ) {
    super(`Image processing failed: ${code}`);
    this.name = "ImageProcessingError";
  }
}

type Drawable = ImageBitmap | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;

function sourceSize(source: Drawable): { width: number; height: number } {
  if (source instanceof HTMLVideoElement) return { width: source.videoWidth, height: source.videoHeight };
  if (source instanceof HTMLImageElement) return { width: source.naturalWidth, height: source.naturalHeight };
  return { width: source.width, height: source.height };
}

function isHeic(file: Blob & { name?: string }): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name ?? "");
}

async function decodeImage(file: Blob): Promise<Drawable> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Fall through to the <img> decoder (older Safari).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function renderScaled(source: Drawable, maxEdge: number): HTMLCanvasElement {
  const { width, height } = sourceSize(source);
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageProcessingError("noCanvas");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ImageProcessingError("encode"))),
      "image/jpeg",
      quality,
    );
  });
}

/** Highest resolution and JPEG quality that fit the per-photo budget. */
async function encodeForAnalysis(source: Drawable): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  let canvas: HTMLCanvasElement | null = null;
  for (const edge of ANALYSIS_EDGES) {
    canvas = renderScaled(canvas ?? source, edge);
    for (const quality of JPEG_QUALITIES) {
      const blob = await canvasToJpeg(canvas, quality);
      if (blob.size <= PHOTO_TARGET_BYTES) return { blob, canvas };
    }
  }
  const blob = canvas ? await canvasToJpeg(canvas, 0.6) : null;
  if (canvas && blob && blob.size <= PHOTO_TARGET_BYTES * 1.4) return { blob, canvas };
  throw new ImageProcessingError("tooHeavy");
}

async function processDrawable(source: Drawable): Promise<ProcessedImage> {
  const { width, height } = sourceSize(source);
  if (!width || !height) throw new ImageProcessingError("empty");
  if (Math.min(width, height) < MIN_DIMENSION) {
    throw new ImageProcessingError("tooSmall", { width, height, min: MIN_DIMENSION });
  }
  const { blob, canvas } = await encodeForAnalysis(source);
  const quality = assessCanvas(canvas);
  const thumbnail = await canvasToJpeg(renderScaled(canvas, THUMBNAIL_MAX_EDGE), 0.8);
  const detail = await centreDetail(source).catch(() => undefined);
  return { blob, thumbnail, width: canvas.width, height: canvas.height, quality, detail };
}

const DETAIL_MIN_SOURCE_EDGE = 3000;

/** Centre crop at the original resolution (no downscaling), within the per-photo budget. */
async function centreDetail(source: Drawable): Promise<Blob | undefined> {
  const { width, height } = sourceSize(source);
  if (Math.max(width, height) < DETAIL_MIN_SOURCE_EDGE) return undefined;
  const f = Math.min(0.6, ANALYSIS_EDGES[0] / Math.max(width, height));
  const w = Math.round(width * f);
  const h = Math.round(height * f);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  ctx.drawImage(source, Math.round((width - w) / 2), Math.round((height - h) / 2), w, h, 0, 0, w, h);
  for (const quality of JPEG_QUALITIES) {
    const blob = await canvasToJpeg(canvas, quality);
    if (blob.size <= PHOTO_TARGET_BYTES) return blob;
  }
  return undefined;
}

/** Validates and prepares an image chosen from the gallery / file system. */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  const looksLikeImage = file.type.startsWith("image/") || isHeic(file) || file.type === "";
  if (!looksLikeImage) throw new ImageProcessingError("notImage");
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageProcessingError("tooLarge");
  }

  let source: Drawable;
  try {
    source = await decodeImage(file);
  } catch {
    if (isHeic(file)) {
      throw new ImageProcessingError("heic");
    }
    throw new ImageProcessingError("unreadable");
  }

  try {
    return await processDrawable(source);
  } finally {
    if ("close" in source && typeof source.close === "function") source.close();
  }
}

/** Prepares a still photo taken by the camera API (ImageCapture.takePhoto). */
export async function processImageBlob(blob: Blob): Promise<ProcessedImage> {
  const source = await decodeImage(blob).catch(() => {
    throw new ImageProcessingError("unreadable");
  });
  try {
    return await processDrawable(source);
  } finally {
    if ("close" in source && typeof source.close === "function") source.close();
  }
}

/** Grabs the current frame of a live camera stream. */
export async function captureVideoFrame(video: HTMLVideoElement): Promise<ProcessedImage> {
  if (!video.videoWidth) throw new ImageProcessingError("cameraNotReady");
  return processDrawable(video);
}
