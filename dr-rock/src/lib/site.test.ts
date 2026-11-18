import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("download links", () => {
  it("point to a real file (no download buttons to missing files)", () => {
    const file = path.join(import.meta.dirname, "..", "..", "public", siteConfig.androidApk.href);
    expect(existsSync(file)).toBe(true);
    const mb = statSync(file).size / 1024 / 1024;
    expect(`${mb.toFixed(1)} MB`).toBe(siteConfig.androidApk.size);
  });
});
