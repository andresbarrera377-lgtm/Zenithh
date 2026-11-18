import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { IOS_SPLASH_SCREENS, splashFile } from "./ios-splash";

describe("iOS launch screens", () => {
  it("exist at the exact pixel size of every listed screen", async () => {
    const files = new Set<string>();
    for (const screen of IOS_SPLASH_SCREENS) {
      const file = path.join(import.meta.dirname, "..", "..", "..", "public", splashFile(screen));
      expect(existsSync(file), file).toBe(true);
      const meta = await sharp(file).metadata();
      expect([meta.width, meta.height]).toEqual([screen.width * screen.ratio, screen.height * screen.ratio]);
      files.add(file);
    }
    expect(files.size).toBe(IOS_SPLASH_SCREENS.length); // no two screens share a file
  });
});
