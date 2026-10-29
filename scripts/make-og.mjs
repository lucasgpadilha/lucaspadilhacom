// Renders the 1200×630 social preview images into public/og/ with the site's own fonts and tokens.
// The home cards are the real hero, shot from a running preview in its finished state:
// `npm run build && npm run preview`, then `node scripts/make-og.mjs`.
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// setContent pages cannot load file:// URLs, so the fonts are inlined as data URIs.
const font = async (path) => `data:font/woff2;base64,${(await readFile(new URL(`../node_modules/${path}`, import.meta.url))).toString('base64')}`;
const sans = await font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2');
const mono = await font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2');
const out = fileURLToPath(new URL('../public/og/', import.meta.url));

const cards = [
  { file: 'sites.jpg', label: 'lucaspadilha.com/sites', title: 'Sites rápidos e bonitos para negócios que querem ser encontrados.', foot: 'Você vê a prévia antes de fechar', signal: true },
];

const html = ({ label, title, foot, signal, night }) => `<!doctype html><html><head><style>
@font-face { font-family: S; src: url('${sans}') format('woff2'); font-weight: 200 800; }
@font-face { font-family: M; src: url('${mono}') format('woff2'); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: ${signal ? '#ff5a1f' : night ? '#0d0d0c' : '#f2efe8'}; color: ${signal ? '#1c0b02' : night ? '#ece9e1' : '#141413'};
  font-family: S; padding: 64px 72px; display: grid; grid-template-rows: auto 1fr auto; }
.top { display: flex; justify-content: space-between; align-items: center; font-family: M; font-size: 22px; font-weight: 600; letter-spacing: .04em; }
.mark { width: 56px; height: 56px; display: grid; place-items: center; background: ${signal ? '#1c0b02' : night ? '#ece9e1' : '#141413'}; color: ${signal ? '#ff5a1f' : night ? '#0d0d0c' : '#f2efe8'}; font-family: M; font-weight: 700; font-size: 20px; border-radius: 4px; }
h1 { align-self: center; font-size: 72px; line-height: .98; letter-spacing: -.035em; font-weight: 680; max-width: 16ch; }
.foot { display: flex; justify-content: space-between; align-items: center; border-top: 3px solid currentColor; padding-top: 22px; font-family: M; font-size: 22px; text-transform: uppercase; letter-spacing: .06em; }
.dot { width: 22px; height: 22px; border-radius: 50%; background: ${signal ? '#1c0b02' : '#ff5a1f'}; }
</style></head><body>
<div class="top"><span>${label}</span><span class="mark">LP</span></div>
<h1>${title}</h1>
<div class="foot"><span>${foot}</span><span class="dot"></span></div>
</body></html>`;

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out + card.file, type: 'jpeg', quality: 86 });
  console.log(`wrote public/og/${card.file}`);
}

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const hero = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
for (const [path, file] of [['/', 'home-en.jpg'], ['/pt/', 'home-pt.jpg']]) {
  await hero.goto(base + path, { waitUntil: 'networkidle' });
  // Title and drawing only: the copy, the run controls and the nav are for visitors, not for a card.
  await hero.addStyleTag({ content: `
    .hero .copy, .hero .legend, .site-header nav, .site-header .tools { display: none !important; }
    .hero .grid { grid-template-areas: 'title explorer' !important; grid-template-rows: 1fr !important; align-items: center; }
    .hero h1 { align-self: center !important; }
    .hero .stage { width: min(100%, calc(420px * var(--ratio))) !important; margin-inline: auto 3rem !important; }` });
  await hero.evaluate(() => document.fonts.ready);
  await hero.waitForTimeout(300);
  await hero.screenshot({ path: out + file, type: 'jpeg', quality: 86 });
  console.log(`wrote public/og/${file}`);
}
await browser.close();
