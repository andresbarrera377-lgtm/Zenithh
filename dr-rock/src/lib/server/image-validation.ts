/**
 * Server-side image validation. Never trust the client: the declared MIME type and
 * file name are ignored, the real format is detected from the file's magic bytes,
 * and dimensions are read from the image header without decoding the pixels.
 */

export const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

/**
 * 3.5 MB raw ≈ 4.7 MB once base64-encoded, safely below the 5 MB per-image limit of the
 * Claude API. The client prepares photos as ≤2576 px JPEGs of about 1.35 MB at most before
 * upload (see lib/analysis/photos.ts for the per-request budget).
 */
export const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;
export const MIN_IMAGE_DIMENSION = 200;
export const MAX_IMAGE_DIMENSION = 8000;

export function detectImageType(bytes: Uint8Array): AllowedMediaType | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return "image/png";
  if (
    bytes[0] === 0x52 && // R
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x46 && // F
    bytes[8] === 0x57 && // W
    bytes[9] === 0x45 && // E
    bytes[10] === 0x42 && // B
    bytes[11] === 0x50 // P
  )
    return "image/webp";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "image/gif";
  return null;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

function readJpegDimensions(b: Uint8Array): ImageDimensions | null {
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = b[offset + 1];
    // Standalone markers without a length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0xff) {
      offset += marker === 0xff ? 1 : 2;
      continue;
    }
    const length = (b[offset + 2] << 8) | b[offset + 3];
    // SOF0–SOF15, excluding DHT (C4), JPG (C8) and DAC (CC).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = (b[offset + 5] << 8) | b[offset + 6];
      const width = (b[offset + 7] << 8) | b[offset + 8];
      return { width, height };
    }
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}

function readUInt32BE(b: Uint8Array, o: number) {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
}

function readWebpDimensions(b: Uint8Array): ImageDimensions | null {
  const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
  if (chunk === "VP8 " && b.length >= 30) {
    return { width: ((b[27] << 8) | b[26]) & 0x3fff, height: ((b[29] << 8) | b[28]) & 0x3fff };
  }
  if (chunk === "VP8L" && b.length >= 25) {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X" && b.length >= 30) {
    return {
      width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
      height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
    };
  }
  return null;
}

export function readImageDimensions(bytes: Uint8Array, type: AllowedMediaType): ImageDimensions | null {
  switch (type) {
    case "image/png":
      return bytes.length >= 24 ? { width: readUInt32BE(bytes, 16), height: readUInt32BE(bytes, 20) } : null;
    case "image/gif":
      return bytes.length >= 10 ? { width: bytes[6] | (bytes[7] << 8), height: bytes[8] | (bytes[9] << 8) } : null;
    case "image/webp":
      return readWebpDimensions(bytes);
    case "image/jpeg":
      return readJpegDimensions(bytes);
  }
}

export type ImageValidationResult =
  | { ok: true; mediaType: AllowedMediaType; dimensions: ImageDimensions }
  | { ok: false; code: "IMAGE_TOO_LARGE" | "UNSUPPORTED_IMAGE_TYPE" | "INVALID_IMAGE"; message: string };

export function validateImageBytes(bytes: Uint8Array): ImageValidationResult {
  if (bytes.length === 0) return { ok: false, code: "INVALID_IMAGE", message: "The uploaded file is empty." };
  if (bytes.length > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      code: "IMAGE_TOO_LARGE",
      message: `The image is larger than ${(MAX_IMAGE_BYTES / 1024 / 1024).toFixed(1)} MB.`,
    };
  }
  const mediaType = detectImageType(bytes);
  if (!mediaType) {
    return {
      ok: false,
      code: "UNSUPPORTED_IMAGE_TYPE",
      message: "Unsupported image format. Please use JPG, PNG, WebP or GIF.",
    };
  }
  const dimensions = readImageDimensions(bytes, mediaType);
  if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
    return { ok: false, code: "INVALID_IMAGE", message: "The image appears to be corrupted." };
  }
  if (Math.min(dimensions.width, dimensions.height) < MIN_IMAGE_DIMENSION) {
    return {
      ok: false,
      code: "INVALID_IMAGE",
      message: `The image is too small (minimum ${MIN_IMAGE_DIMENSION}px per side). Move closer or use a higher resolution.`,
    };
  }
  if (Math.max(dimensions.width, dimensions.height) > MAX_IMAGE_DIMENSION) {
    return {
      ok: false,
      code: "INVALID_IMAGE",
      message: `The image is too large (maximum ${MAX_IMAGE_DIMENSION}px per side).`,
    };
  }
  return { ok: true, mediaType, dimensions };
}
