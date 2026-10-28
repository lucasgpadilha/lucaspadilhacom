// Captures each concept site for the /sites/ showcase thumbnails and its social image.
// Needs a running preview: `npm run build && npm run preview`, then `node scripts/shoot-demos.mjs`.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const slugs = ['advocacia', 'odontologia', 'cafe'];
const thumbs = fileURLToPath(new URL('../public/sites/thumbs/', import.meta.url));
const og = fileURLToPath(new URL('../public/og/', import.meta.url));

await mkdir(thumbs, { recursive: true });
await mkdir(og, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
for (const slug of slugs) {
  await page.goto(`${base}/sites/exemplos/${slug}/`, { waitUntil: 'networkidle' });
  // The concept-site strip is for visitors of the demo, not for its thumbnail.
  await page.addStyleTag({ content: '.demo-banner { display: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const shot = await page.screenshot({ type: 'png' });
  for (const width of [640, 1280]) {
    await sharp(shot).resize({ width }).webp({ quality: 78 }).toFile(`${thumbs}${slug}-${width}.webp`);
  }
  await sharp(shot).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 84, mozjpeg: true }).toFile(`${og}demo-${slug}.jpg`);
  console.log(`shot ${slug}`);
}
await browser.close();
