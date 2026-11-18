/**
 * Renders the source images @capacitor/assets needs, from the same mark geometry the web
 * app uses for its PWA icons, so the Android icon always matches the brand.
 *
 * Run from dr-rock-mobile/:  ../dr-rock/node_modules/.bin/tsx scripts/icon-sources.ts
 * then:                       npx capacitor-assets generate --android
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { markSvg } from "../../dr-rock/src/lib/brand/mark-geometry";

const CARBON = "#0b0e0d";
const out = path.join(process.cwd(), "assets");

async function main() {
  mkdirSync(out, { recursive: true });

  // Legacy (pre-Android 8) icon: full mark on its rounded tile.
  await sharp(Buffer.from(markSvg({ size: 1024, padding: 4 }))).resize(1024, 1024).png().toFile(path.join(out, "icon-only.png"));

  // Adaptive icon: the generated XML insets the foreground by 16.7% (to the 72dp viewport), so
  // the mark only needs a small margin to stay inside the 66dp safe circle.
  await sharp(Buffer.from(markSvg({ size: 1024, padding: 6, background: null }))).resize(1024, 1024).png().toFile(path.join(out, "icon-foreground.png"));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: CARBON } }).png().toFile(path.join(out, "icon-background.png"));

  // Splash (pre-Android 12 devices): small mark centred on carbon black.
  const mark = await sharp(Buffer.from(markSvg({ size: 640, padding: 4, background: null }))).png().toBuffer();
  for (const name of ["splash.png", "splash-dark.png"]) {
    await sharp({ create: { width: 2732, height: 2732, channels: 4, background: CARBON } })
      .composite([{ input: mark, gravity: "center" }])
      .png()
      .toFile(path.join(out, name));
  }
  console.log("icon sources written to", out);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
