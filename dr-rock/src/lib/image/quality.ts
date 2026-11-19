/**
 * On-device photo quality check. Runs on a small grayscale copy of the photo (no upload, no AI)
 * and flags the problems that most often ruin an identification: blur, bad exposure, flat
 * contrast and low resolution. The thresholds are deliberately forgiving: a warning is a hint
 * to retake, never a block.
 */

export type QualityWarning = "blurry" | "soft" | "dark" | "overexposed" | "lowContrast" | "lowRes";

export interface PhotoQuality {
  /** good: no problems; fair: minor problems; poor: likely to hurt the identification. */
  score: "good" | "fair" | "poor";
  warnings: QualityWarning[];
  /** Focus measure on the 640 px grayscale copy: Laplacian variance of the sharpest tiles (higher = sharper). */
  sharpness: number;
  /** Mean luminance, 0–255. */
  brightness: number;
  /** Standard deviation of luminance, 0–255. */
  contrast: number;
}

/** Long edge of the grayscale copy the metrics are computed on (keeps them comparable). */
export const QUALITY_SAMPLE_EDGE = 640;

export const QUALITY_THRESHOLDS = {
  blurry: 20,
  soft: 60,
  /** Underexposed when even the brightest 1 % stays below this (dark rocks still have highlights). */
  darkP99: 100,
  /** Overexposed when this share of pixels is clipped white, or the median is near white. */
  clipped: 0.22,
  brightMedian: 242,
  lowContrast: 12,
  minShortEdge: 900,
} as const;

const SEVERE: QualityWarning[] = ["blurry", "dark", "overexposed"];

/**
 * Computes quality metrics from 8-bit grayscale pixels (row-major, width × height).
 * `sourceShortEdge` is the short edge of the photo that will be sent (for the resolution check).
 */
export function assessGray(gray: ArrayLike<number>, width: number, height: number, sourceShortEdge: number): PhotoQuality {
  const n = width * height;
  let sum = 0;
  let sumSq = 0;
  let clipped = 0;
  const histogram = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const v = gray[i];
    sum += v;
    sumSq += v * v;
    histogram[Math.max(0, Math.min(255, Math.round(v)))]++;
    if (v >= 250) clipped++;
  }
  const percentile = (q: number) => {
    let acc = 0;
    const target = q * n;
    for (let v = 0; v < 256; v++) {
      acc += histogram[v];
      if (acc >= target) return v;
    }
    return 255;
  };
  const p99 = percentile(0.99);
  const median = percentile(0.5);
  const brightness = n ? sum / n : 0;
  const contrast = n ? Math.sqrt(Math.max(0, sumSq / n - brightness * brightness)) : 0;

  // Focus measure: variance of the 4-neighbour Laplacian, computed per tile. Using the sharpest
  // tiles (90th percentile) instead of the whole frame keeps smooth subjects (obsidian, polished
  // stone, plain backgrounds) from reading as blurry: a focused photo always has some crisp area.
  const tiles = 8;
  const tileW = Math.max(3, Math.floor(width / tiles));
  const tileH = Math.max(3, Math.floor(height / tiles));
  const variances: number[] = [];
  for (let ty = 0; ty + tileH <= height; ty += tileH) {
    for (let tx = 0; tx + tileW <= width; tx += tileW) {
      let lapSum = 0;
      let lapSq = 0;
      let count = 0;
      for (let y = Math.max(1, ty); y < Math.min(height - 1, ty + tileH); y++) {
        for (let x = Math.max(1, tx); x < Math.min(width - 1, tx + tileW); x++) {
          const i = y * width + x;
          const lap = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - width] - gray[i + width];
          lapSum += lap;
          lapSq += lap * lap;
          count++;
        }
      }
      if (count) {
        const mean = lapSum / count;
        variances.push(lapSq / count - mean * mean);
      }
    }
  }
  variances.sort((x, y) => x - y);
  const sharpness = variances.length ? variances[Math.min(variances.length - 1, Math.floor(variances.length * 0.9))] : 0;

  const t = QUALITY_THRESHOLDS;
  const warnings: QualityWarning[] = [];
  if (sharpness < t.blurry) warnings.push("blurry");
  else if (sharpness < t.soft) warnings.push("soft");
  // Judged on highlights and clipping, not the average: a black basalt or a white chalk that fills
  // the frame is not an exposure problem.
  if (p99 < t.darkP99) warnings.push("dark");
  else if (median > t.brightMedian || clipped / Math.max(1, n) > t.clipped) warnings.push("overexposed");
  if (contrast < t.lowContrast) warnings.push("lowContrast");
  if (sourceShortEdge < t.minShortEdge) warnings.push("lowRes");

  const score = warnings.some((w) => SEVERE.includes(w)) ? "poor" : warnings.length > 0 ? "fair" : "good";
  return {
    score,
    warnings,
    sharpness: Math.round(sharpness),
    brightness: Math.round(brightness),
    contrast: Math.round(contrast),
  };
}

/** Browser helper: grayscale sample of a canvas, then `assessGray`. */
export function assessCanvas(canvas: HTMLCanvasElement): PhotoQuality {
  const scale = Math.min(1, QUALITY_SAMPLE_EDGE / Math.max(canvas.width, canvas.height));
  const w = Math.max(3, Math.round(canvas.width * scale));
  const h = Math.max(3, Math.round(canvas.height * scale));
  const sample = document.createElement("canvas");
  sample.width = w;
  sample.height = h;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  const shortEdge = Math.min(canvas.width, canvas.height);
  if (!ctx) return { score: "good", warnings: [], sharpness: 0, brightness: 0, contrast: 0 };
  ctx.drawImage(canvas, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // Rec. 601 luma
    gray[j] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
  }
  return assessGray(gray, w, h, shortEdge);
}
