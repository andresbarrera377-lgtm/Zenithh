/**
 * Generates static assets from code so they stay in sync with the design:
 *  - public/library/<id>.svg : procedural illustration for every Rock Library entry
 *  - public/icons/*.png, src/app/icon.svg, src/app/apple-icon.png : PWA & favicon icons
 *  - public/splash/ios-*.png : launch screens for the iPhone/iPad home-screen app
 *
 * Run with: npm run generate:assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { SpecimenArt } from "../src/components/art/SpecimenArt";
import { IOS_SPLASH_SCREENS, splashFile } from "../src/lib/brand/ios-splash";
import { markSvg } from "../src/lib/brand/mark-geometry";
import { LIBRARY } from "../src/lib/library";

const root = process.cwd();

async function main() {
  const libraryDir = path.join(root, "public", "library");
  mkdirSync(libraryDir, { recursive: true });
  let total = 0;
  for (const entry of LIBRARY) {
    const svg = renderToStaticMarkup(<SpecimenArt seed={entry.id} art={entry.art} title={entry.name} />);
    writeFileSync(path.join(libraryDir, `${entry.id}.svg`), svg);
    total += svg.length;
  }
  console.log(`library: ${LIBRARY.length} illustrations, ${(total / 1024).toFixed(0)} KB total`);

  const iconsDir = path.join(root, "public", "icons");
  mkdirSync(iconsDir, { recursive: true });
  const standard = Buffer.from(markSvg({ size: 512 }));
  // Maskable icons need the artwork inside the central 80% safe zone.
  const maskable = Buffer.from(markSvg({ size: 512, padding: 10 }));
  await sharp(standard).resize(192, 192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(standard).resize(512, 512).png().toFile(path.join(iconsDir, "icon-512.png"));
  await sharp(maskable).resize(512, 512).png().toFile(path.join(iconsDir, "maskable-512.png"));
  await sharp(Buffer.from(markSvg({ size: 180, padding: 6 }))).resize(180, 180).png().toFile(path.join(root, "src", "app", "apple-icon.png"));
  writeFileSync(path.join(root, "src", "app", "icon.svg"), markSvg({ size: 64, background: null }));
  console.log("icons: generated");

  // iOS launch screens: the mark on carbon black with a soft mineral glow, like the app's home screen.
  const splashDir = path.join(root, "public", "splash");
  mkdirSync(splashDir, { recursive: true });
  for (const screen of IOS_SPLASH_SCREENS) {
    const w = screen.width * screen.ratio;
    const h = screen.height * screen.ratio;
    const markSize = Math.round(Math.min(w, h) * 0.28);
    const glow = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${w / 2}" cy="${h * 0.46}" r="${Math.min(w, h) * 0.6}"><stop offset="0" stop-color="#1b4d38" stop-opacity="0.5"/><stop offset="1" stop-color="#0b0e0d" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="#0b0e0d"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
    );
    const mark = await sharp(Buffer.from(markSvg({ size: markSize, padding: 2, background: null }))).png().toBuffer();
    await sharp(glow)
      .composite([{ input: mark, left: Math.round((w - markSize) / 2), top: Math.round(h * 0.46 - markSize / 2) }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(root, "public", splashFile(screen)));
  }
  console.log(`splash: ${IOS_SPLASH_SCREENS.length} iOS launch screens`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
