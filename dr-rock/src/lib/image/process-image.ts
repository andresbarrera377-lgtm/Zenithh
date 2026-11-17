/**
 * Client-side image preparation.
 *
 * Every photo — camera capture or upload — is decoded, rotated according to its EXIF
 * orientation, downscaled and re-encoded as JPEG before it leaves the device. This:
 * - keeps uploads small and fast on mobile networks,
 * - stays well inside the AI provider's per-image limits,
 * - strips EXIF metadata (including GPS location) for privacy.
 */

export const ACCEPTED_IMAGE_INPUT = "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif";
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;
export const MIN_DIMENSION = 200;

const ANALYSIS_MAX_EDGE = 1600;
const THUMBNAIL_MAX_EDGE = 480;
const TARGET_MAX_BYTES = 2.5 * 1024 * 1024;

export interface ProcessedImage {
  blob: Blob;
  thumbnail: Blob;
  width: number;
  height: number;
}

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
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
  if (!ctx) throw new ImageProcessingError("Your browser could not process this image.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return canvas;
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ImageProcessingError("Could not encode the image."))),
      "image/jpeg",
      quality,
    );
  });
}

async function encodeForAnalysis(canvas: HTMLCanvasElement): Promise<Blob> {
  for (const quality of [0.88, 0.8, 0.7, 0.6]) {
    const blob = await canvasToJpeg(canvas, quality);
    if (blob.size <= TARGET_MAX_BYTES) return blob;
  }
  throw new ImageProcessingError("The image could not be compressed enough. Try a smaller photo.");
}

async function processDrawable(source: Drawable): Promise<ProcessedImage> {
  const { width, height } = sourceSize(source);
  if (!width || !height) throw new ImageProcessingError("The image appears to be empty.");
  if (Math.min(width, height) < MIN_DIMENSION) {
    throw new ImageProcessingError(
      `This image is too small (${width}×${height}px). Use a photo at least ${MIN_DIMENSION}px on each side.`,
    );
  }
  const analysisCanvas = renderScaled(source, ANALYSIS_MAX_EDGE);
  const blob = await encodeForAnalysis(analysisCanvas);
  const thumbnail = await canvasToJpeg(renderScaled(analysisCanvas, THUMBNAIL_MAX_EDGE), 0.8);
  return { blob, thumbnail, width: analysisCanvas.width, height: analysisCanvas.height };
}

/** Validates and prepares an image chosen from the gallery / file system. */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  const looksLikeImage = file.type.startsWith("image/") || isHeic(file) || file.type === "";
  if (!looksLikeImage) throw new ImageProcessingError("That file is not an image. Please choose a photo.");
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageProcessingError("This photo is larger than 25 MB. Please choose a smaller image.");
  }

  let source: Drawable;
  try {
    source = await decodeImage(file);
  } catch {
    if (isHeic(file)) {
      throw new ImageProcessingError(
        "This browser can't read HEIC photos. Use Safari, or set your camera to “Most Compatible” (JPG) and try again.",
      );
    }
    throw new ImageProcessingError("This image could not be read. Please use a JPG, PNG or WebP photo.");
  }

  try {
    return await processDrawable(source);
  } finally {
    if ("close" in source && typeof source.close === "function") source.close();
  }
}

/** Grabs the current frame of a live camera stream. */
export async function captureVideoFrame(video: HTMLVideoElement): Promise<ProcessedImage> {
  if (!video.videoWidth) throw new ImageProcessingError("The camera is not ready yet.");
  return processDrawable(video);
}
