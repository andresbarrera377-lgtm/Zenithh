import { describe, expect, it } from "vitest";
import { QUALITY_THRESHOLDS, assessGray } from "./quality";

/** Deterministic pseudo-random texture (a "rock surface") and a box-blurred copy of it. */
function texture(w: number, h: number, seed = 7): Uint8ClampedArray {
  const out = new Uint8ClampedArray(w * h);
  let x = seed;
  for (let i = 0; i < out.length; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    out[i] = 60 + (x % 120);
  }
  return out;
}

function blur(src: Uint8ClampedArray, w: number, h: number, r: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          sum += src[yy * w + xx];
          n++;
        }
      out[y * w + x] = sum / n;
    }
  return out;
}

describe("assessGray", () => {
  const w = 160;
  const h = 120;

  it("passes a sharp, well-exposed texture", () => {
    const q = assessGray(texture(w, h), w, h, 2000);
    expect(q.score).toBe("good");
    expect(q.warnings).toEqual([]);
  });

  it("flags a blurred copy of the same texture", () => {
    const q = assessGray(blur(texture(w, h), w, h, 4), w, h, 2000);
    expect(q.sharpness).toBeLessThan(QUALITY_THRESHOLDS.blurry);
    expect(q.warnings).toContain("blurry");
    expect(q.score).toBe("poor");
  });

  it("does not call a dark or a white rock badly exposed", () => {
    // Dark rock with a few highlights (specular glints), and a white chalk-like surface.
    const darkRock = texture(w, h).map((v, i) => (i % 50 === 0 ? 200 : v / 4));
    expect(assessGray(darkRock, w, h, 2000).warnings).not.toContain("dark");
    const chalk = texture(w, h).map((v) => 170 + v / 3);
    expect(assessGray(chalk, w, h, 2000).warnings).not.toContain("overexposed");
  });

  it("flags dark, overexposed and low-resolution photos", () => {
    const dark = texture(w, h).map((v) => v / 6);
    expect(assessGray(dark, w, h, 2000).warnings).toContain("dark");
    const bright = new Uint8ClampedArray(w * h).fill(255);
    expect(assessGray(bright, w, h, 2000).warnings).toContain("overexposed");
    expect(assessGray(texture(w, h), w, h, 600).warnings).toEqual(["lowRes"]);
  });

  it("does not call a smooth subject blurry when part of the frame is crisp", () => {
    // Left half smooth (polished stone), right half textured.
    const tex = texture(w, h);
    const mixed = new Uint8ClampedArray(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) mixed[y * w + x] = x < w / 2 ? 120 : tex[y * w + x];
    expect(assessGray(mixed, w, h, 2000).warnings).not.toContain("blurry");
  });
});
