import sharp from 'sharp';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Only rendered, owner-supplied captures enter the public site; never 3D sources.
const root = resolve(import.meta.dirname, '..');
const mockups = resolve(root, '../mockups');
const output = resolve(root, 'public/startup');
await mkdir(`${output}/fonts`, { recursive: true });
const captures = [
  ['serra', '01-serra.jpg'], ['sertao', '02-sertao.jpg'],
  ['noite', '03-estrada-noturna.jpg'], ['patio', '04-patio.jpg'],
  ['subida', '05-minigame-subida.jpg'],
];
for (const [name, file] of captures) {
  for (const width of [360, 720, 1080]) {
    await sharp(resolve(mockups, file)).resize({ width }).webp({ quality: 82 }).toFile(`${output}/${name}-${width}.webp`);
  }
}
const hero = resolve(root, '../seu-caminhao-na-br/apps/live-overlay/public/review/serra-starter.png');
for (const width of [360, 720, 1080]) {
  await sharp(hero).resize({ width }).webp({ quality: 85 }).toFile(`${output}/hero-${width}.webp`);
}
for (const weight of [600, 800]) {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-${weight}-normal.woff2`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  await writeFile(`${output}/fonts/barlow-condensed-${weight}.woff2`, Buffer.from(await response.arrayBuffer()));
}
await copyFile(resolve(root, '../seu-caminhao-na-br/apps/live-overlay/public/licenses/BARLOW-CONDENSED-OFL.txt'), `${output}/fonts/OFL.txt`);
const poster = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
 <rect width="1200" height="630" fill="#163d37"/>
 <path d="M55 72v94l70-94v94m-58-94v94l70-94v94" stroke="#b9d3b9" stroke-width="7" fill="none"/>
 <g fill="#edf2ef" font-family="DejaVu Sans,sans-serif" font-weight="700">
 <text x="52" y="308" font-size="94">NEXORA</text><text x="52" y="414" font-size="94">GAMES</text>
 </g><text x="56" y="531" fill="#b9d3b9" font-family="DejaVu Sans,sans-serif" font-size="25">Independent games. Shared experiences.</text>
</svg>`);
const gameplay = await sharp(hero).resize(430, 630, { fit: 'cover', position: 'centre' }).toBuffer();
await sharp(poster).composite([{ input: gameplay, left: 770, top: 0 }]).jpeg({ quality: 88 }).toFile(`${output}/og-nexora.jpg`);
console.log('Prepared responsive gameplay media, local fonts, font license and social preview.');
