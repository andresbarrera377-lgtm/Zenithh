/**
 * Generates static assets from code so they stay in sync with the design:
 *  - public/library/<id>.svg : procedural illustration for every Rock Library entry
 *  - public/icons/*.png, src/app/icon.svg, src/app/apple-icon.png : PWA & favicon icons
 *
 * Run with: npm run generate:assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { SpecimenArt } from "../src/components/art/SpecimenArt";
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
