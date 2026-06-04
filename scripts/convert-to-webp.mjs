import sharp from "sharp";
import { readdir, unlink } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC = new URL("../public", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// PNGs to convert (all of them except tiny icons)
// SVGs to convert — only the ones we know are raster-heavy (>100KB)
const SVG_RASTER = new Set([
  "patient-home.svg",
  "patient-device.svg",
  "about-photo-cafe.svg",
  "about-photo-canal.svg",
  "about-photo-zion.svg",
  "about-profile.svg",
]);

const files = await readdir(PUBLIC);

for (const file of files) {
  const ext  = extname(file).toLowerCase();
  const base = basename(file, ext);
  const src  = join(PUBLIC, file);
  const dest = join(PUBLIC, base + ".webp");

  const isPng       = ext === ".png";
  const isRasterSvg = ext === ".svg" && SVG_RASTER.has(file);

  if (!isPng && !isRasterSvg) continue;

  // Skip tiny icons (under 10 KB) — not worth converting
  const { size } = await import("fs").then(m => m.promises.stat(src));
  if (size < 10_000) { console.log(`skip  ${file} (${Math.round(size/1024)}KB — too small)`); continue; }

  try {
    const info = await sharp(src).webp({ quality: 88 }).toFile(dest);
    console.log(`✓  ${file} → ${base}.webp  (${Math.round(size/1024)}KB → ${Math.round(info.size/1024)}KB)`);
  } catch (e) {
    console.warn(`✗  ${file}: ${e.message}`);
  }
}

console.log("\nDone. Original files kept — verify output before deleting.");
