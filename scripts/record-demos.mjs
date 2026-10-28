// Records a short WebM preview of each concept site's authored moment for /sites/.
// Needs a running preview (`npm run build && npm run preview`) and Playwright's bundled ffmpeg.
// Usage: node scripts/record-demos.mjs [slug...]
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ['advocacia', 'odontologia', 'cafe'];
const out = fileURLToPath(new URL('../public/sites/previews/', import.meta.url));

async function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dir = (await readdir(root)).filter((name) => name.startsWith('ffmpeg-')).sort().pop();
  if (!dir) throw new Error('ffmpeg not found: run `npx playwright install ffmpeg` or set FFMPEG');
  return join(root, dir, process.platform === 'darwin' ? 'ffmpeg-mac' : 'ffmpeg-linux');
}

const ffmpeg = await findFfmpeg();
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

for (const slug of slugs) {
  const raw = await mkdtemp(join(tmpdir(), `rec-${slug}-`));
  const t0 = Date.now();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: raw, size: { width: 1280, height: 800 } } });
  const page = await context.newPage();
  await page.goto(`${base}/sites/exemplos/${slug}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.demo-banner { display: none !important; } html { scroll-behavior: auto !important; }' });
  // Some scenes mount late (after a delay or the first scroll): nudge, then wait for the host.
  await page.mouse.wheel(0, 1);
  await page.waitForFunction(() => document.querySelector('[data-scene]'), null, { timeout: 8000 }).catch(() => {});
  // The scroll range that drives the scene: its pin spacer when pinned, else its section.
  const range = await page.evaluate(() => {
    const host = document.querySelector('[data-scene]');
    const box = host?.closest('.pin-spacer') ?? host?.closest('section') ?? document.body;
    const rect = box.getBoundingClientRect();
    const top = Math.max(0, rect.top + scrollY - 40);
    const spacer = host?.closest('.pin-spacer');
    // Pinned: scroll exactly the pin distance (spacer minus the pinned element), so the scene ends in view.
    const end = spacer
      ? top + 40 + (spacer.offsetHeight - spacer.firstElementChild.offsetHeight) * 0.98
      : rect.bottom + scrollY - innerHeight * 0.45;
    return { top, end: Math.min(document.documentElement.scrollHeight - innerHeight, Math.max(top + innerHeight * 0.6, end)) };
  });
  await page.evaluate((y) => window.scrollTo(0, y), range.top);
  await page.waitForFunction(() => document.querySelector('[data-scene]')?.dataset.scene === 'live', null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2600); // bounded intro
  const startAt = (Date.now() - t0) / 1000 - 0.4;
  await page.evaluate(async ({ top, end }) => {
    const duration = 4800;
    const begin = performance.now();
    await new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - begin) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        window.scrollTo(0, top + (end - top) * eased);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }, range);
  await page.waitForTimeout(700);
  const video = page.video();
  await context.close();
  const source = await video.path();
  // Start just before the scroll, keep ~6.5 s, 960 px wide, modest bitrate.
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', startAt.toFixed(2), '-i', source, '-t', '6.5', '-vf', 'scale=960:-2', '-an', '-c:v', 'libvpx', '-b:v', '900k', '-crf', '12', '-deadline', 'good', join(out, `${slug}.webm`)]);
  await rm(raw, { recursive: true, force: true });
  console.log(`recorded ${slug}`);
}
await browser.close();
