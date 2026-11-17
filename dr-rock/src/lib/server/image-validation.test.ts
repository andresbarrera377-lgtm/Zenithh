import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, detectImageType, readImageDimensions, validateImageBytes } from "./image-validation";

function png(width: number, height: number): Uint8Array {
  const b = new Uint8Array(64);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  new DataView(b.buffer).setUint32(16, width);
  new DataView(b.buffer).setUint32(20, height);
  return b;
}

function jpeg(width: number, height: number): Uint8Array {
  // SOI, APP0 (length 16), SOF0 with dimensions.
  const app0 = [0xff, 0xe0, 0x00, 0x10, ...new Array(14).fill(0)];
  const sof0 = [0xff, 0xc0, 0x00, 0x11, 0x08, height >> 8, height & 0xff, width >> 8, width & 0xff, 0x03, ...new Array(9).fill(0)];
  return new Uint8Array([0xff, 0xd8, ...app0, ...sof0, 0xff, 0xd9]);
}

describe("detectImageType", () => {
  it("recognises formats from magic bytes, not names", () => {
    expect(detectImageType(png(10, 10))).toBe("image/png");
    expect(detectImageType(jpeg(10, 10))).toBe("image/jpeg");
    expect(detectImageType(new TextEncoder().encode("GIF89a......"))).toBe("image/gif");
    expect(detectImageType(new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8 "))).toBe("image/webp");
    expect(detectImageType(new TextEncoder().encode("<svg xmlns='...'>"))).toBeNull();
  });
});

describe("readImageDimensions", () => {
  it("reads PNG and JPEG headers", () => {
    expect(readImageDimensions(png(1200, 900), "image/png")).toEqual({ width: 1200, height: 900 });
    expect(readImageDimensions(jpeg(1600, 1200), "image/jpeg")).toEqual({ width: 1600, height: 1200 });
  });
});

describe("validateImageBytes", () => {
  it("accepts a reasonable photo", () => {
    const r = validateImageBytes(jpeg(1600, 1200));
    expect(r.ok).toBe(true);
  });
  it("rejects unsupported formats", () => {
    const r = validateImageBytes(new TextEncoder().encode("%PDF-1.7 not an image at all"));
    expect(r).toMatchObject({ ok: false, code: "UNSUPPORTED_IMAGE_TYPE" });
  });
  it("rejects images that are too small or too big", () => {
    expect(validateImageBytes(png(120, 90))).toMatchObject({ ok: false, code: "INVALID_IMAGE" });
    expect(validateImageBytes(png(9000, 9000))).toMatchObject({ ok: false, code: "INVALID_IMAGE" });
    expect(validateImageBytes(new Uint8Array(MAX_IMAGE_BYTES + 1))).toMatchObject({ ok: false, code: "IMAGE_TOO_LARGE" });
  });
  it("rejects empty files", () => {
    expect(validateImageBytes(new Uint8Array(0))).toMatchObject({ ok: false, code: "INVALID_IMAGE" });
  });
});
