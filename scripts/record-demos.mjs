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
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: raw, size: { width: 1280, height: 800 } } });
  const page = await context.newPage();
  await page.goto(`${base}/sites/exemplos/${slug}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.demo-banner { display: none !important; } html { scroll-behavior: auto !important; }' });
  await page.waitForTimeout(2600); // the scene's bounded intro
  // Scroll through the section that holds the scene, eased, in about 4.5 s.
  await page.evaluate(async () => {
    const host = document.querySelector('[data-scene]');
    const section = host?.closest('section') ?? document.body;
    const end = Math.min(document.documentElement.scrollHeight - innerHeight, section.getBoundingClientRect().bottom + scrollY - innerHeight * 0.55);
    const start = scrollY;
    const duration = 4500;
    const t0 = performance.now();
    await new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        window.scrollTo(0, start + (end - start) * eased);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  });
  await page.waitForTimeout(600);
  const video = page.video();
  await context.close();
  const source = await video.path();
  // Skip the first frames of page load, keep ~7 s, 960 px wide, modest bitrate.
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', '1.2', '-i', source, '-t', '7', '-vf', 'scale=960:-2', '-an', '-c:v', 'libvpx', '-b:v', '900k', '-crf', '12', '-deadline', 'good', join(out, `${slug}.webm`)]);
  await rm(raw, { recursive: true, force: true });
  console.log(`recorded ${slug}`);
}
await browser.close();
