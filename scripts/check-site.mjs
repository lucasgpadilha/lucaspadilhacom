// End-to-end checks for the portfolio, the /sites/ showcase and the concept
// sites. Runs against a production preview: `npm run build && npm run preview`.
import { chromium } from 'playwright';

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const PROD = 'https://lucaspadilha.com';
const widths = (process.env.SITE_WIDTHS || '320,360,390,768,1440,1920').split(',').map(Number);
const local = (url) => url.replace(PROD, base);

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

/** Routes and what every viewport must satisfy. `extra` runs once per route at 390px. */
const routes = [
  { path: '/', lang: 'en' },
  { path: '/pt/', lang: 'pt-BR' },
];

const browser = await chromium.launch();

async function open(path, options = {}) {
  const { init, ...contextOptions } = options;
  const context = await browser.newContext({ locale: 'en-US', ...contextOptions });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const response = await page.goto(base + path, { waitUntil: 'load' });
  return { context, page, errors, response };
}

try {
  for (const route of routes) {
    for (const width of widths) {
      const label = `${route.path} @${width}`;
      const { context, page, errors, response } = await open(route.path, { viewport: { width, height: 900 } });
      check(response.status() === 200, `${label}: status ${response.status()}`);
      const facts = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
        og: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
      }));
      check(facts.overflow <= 0, `${label}: horizontal overflow of ${facts.overflow}px`);
      check(facts.lang === route.lang, `${label}: lang "${facts.lang}" (expected ${route.lang})`);
      check(facts.h1 === 1, `${label}: ${facts.h1} h1 elements`);
      check(facts.canonical.startsWith(`${PROD}/`), `${label}: canonical "${facts.canonical}"`);
      check(facts.og.startsWith(`${PROD}/`), `${label}: og:image "${facts.og}"`);
      check(errors.length === 0, `${label}: ${errors.join(' | ')}`);
      if (width === 390 && route.extra) await route.extra(page, label);
      await context.close();
    }
  }

  // Locale resolution happens before first paint and must survive odd browsers.
  const localeCases = [
    { name: 'pt browser on /', path: '/', options: { locale: 'pt-BR' }, expect: '/pt/' },
    { name: '?lang=pt keeps the hash', path: '/?lang=pt#work', options: {}, expect: '/pt/#work' },
    { name: '/pt/?lang=en', path: '/pt/?lang=en', options: { locale: 'pt-BR' }, expect: '/' },
    {
      name: 'stored EN beats a pt browser', path: '/', expect: '/',
      options: { locale: 'pt-BR', init: () => { try { localStorage.setItem('lucaspadilha.locale', 'en'); } catch {} } },
    },
    {
      name: 'blocked localStorage', path: '/', expect: '/',
      options: { init: () => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }) },
    },
  ];
  for (const item of localeCases) {
    const { context, page, errors } = await open(item.path, item.options);
    await page.waitForLoadState('load');
    const url = new URL(page.url());
    check(url.pathname + url.hash === item.expect, `locale "${item.name}": landed on ${url.pathname}${url.hash}`);
    check(errors.length === 0, `locale "${item.name}": ${errors.join(' | ')}`);
    await context.close();
  }

  // Content must be visible without JavaScript and with reduced motion.
  for (const [name, options] of [['no-js', { javaScriptEnabled: false }], ['reduced-motion', { reducedMotion: 'reduce' }]]) {
    for (const path of ['/', '/pt/']) {
      const { context, page } = await open(path, options);
      await page.waitForTimeout(300);
      const opacities = await page.evaluate(() => [
        document.querySelector('h1'),
        document.querySelector('main section:nth-of-type(2) h2'),
      ].map((el) => (el ? Number(getComputedStyle(el).opacity) : -1)));
      check(opacities.every((value) => value === 1), `${name} ${path}: opacities ${opacities.join(', ')}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`FAIL ${failures.length} check(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`PASS site checks against ${base}`);


