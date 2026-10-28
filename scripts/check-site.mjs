// End-to-end checks for the portfolio, the /sites/ showcase and the concept
// sites. Runs against a production preview: `npm run build && npm run preview`.
import { chromium } from 'playwright';
import sharp from 'sharp';

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const PROD = 'https://lucaspadilha.com';
const widths = (process.env.SITE_WIDTHS || '320,360,390,768,1440,1920').split(',').map(Number);
const local = (url) => url.replace(PROD, base);

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

/** Routes and what every viewport must satisfy. `extra` runs once per route at 390px. */
// Only these repositories are public; private work must never be linked.
const PUBLIC_REPOS = new Set(['lucaspadilhacom', 'pynoc', 'floci-cloud-lab', 'tuildap', 'agent-benchmark']);

async function portfolio(page, label) {
  const facts = await page.evaluate(() => ({
    work: document.querySelectorAll('#work article').length,
    repos: [...document.querySelectorAll('a[href^="https://github.com/lucasgpadilha/"]')]
      .map((a) => new URL(a.href).pathname.split('/')[2]),
    text: document.body.innerText,
  }));
  check(facts.work >= 6, `${label}: #work has ${facts.work} articles`);
  for (const repo of facts.repos) check(PUBLIC_REPOS.has(repo), `${label}: links non-public repo "${repo}"`);
  for (const stale of ['Operational Stack', 'Available for opportunities', 'Nginx']) {
    check(!facts.text.includes(stale), `${label}: still says "${stale}"`);
  }
}

async function demo(page, label) {
  const facts = await page.evaluate(() => {
    const banner = document.querySelector('.demo-banner');
    const rect = banner?.getBoundingClientRect();
    const resources = performance.getEntriesByType('resource');
    const nav = performance.getEntriesByType('navigation')[0];
    const nonImage = resources.filter((r) => r.initiatorType !== 'img' && !/\.(webp|avif|jpe?g|png)(\?|$)/.test(r.name));
    return {
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      banner: Boolean(rect && rect.height > 0 && rect.top >= 0),
      bannerLink: banner?.querySelector('a[href="/sites/#contato"]') !== null && banner !== null,
      tel: document.querySelectorAll('a[href^="tel:"]').length,
      badImages: [...document.images].filter((img) => !img.hasAttribute('alt') || !img.getAttribute('width') || !img.getAttribute('height')).map((img) => img.src),
      bytes: (nav?.transferSize || nav?.encodedBodySize || 0) + nonImage.reduce((sum, r) => sum + (r.transferSize || r.encodedBodySize || 0), 0),
    };
  });
  check(facts.robots.includes('noindex'), `${label}: robots "${facts.robots}"`);
  check(facts.banner && facts.bannerLink, `${label}: concept-site banner missing or not linking to /sites/#contato`);
  check(facts.tel === 0, `${label}: ${facts.tel} tel: links (no real phone numbers on concept sites)`);
  check(facts.badImages.length === 0, `${label}: images without alt/width/height: ${facts.badImages.join(', ')}`);
  check(facts.bytes < 300 * 1024, `${label}: ${Math.round(facts.bytes / 1024)} KB without images (limit 300 KB)`);
}

const DEMOS = ['advocacia', 'odontologia', 'cafe'];
const onlyDemo = process.env.SITE_DEMO;

const routes = [
  { path: '/', lang: 'en', extra: portfolio },
  { path: '/pt/', lang: 'pt-BR', extra: portfolio },
  ...DEMOS.map((slug) => ({ path: `/sites/exemplos/${slug}/`, lang: 'pt-BR', extra: demo })),
].filter((route) => !onlyDemo || route.path === `/sites/exemplos/${onlyDemo}/`)
  .filter((route) => !process.env.SITE_SKIP_DEMOS || !route.path.startsWith('/sites/exemplos/'));

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
  const localeCases = onlyDemo ? [] : [
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

  // SEO files, 404 page, social images and structured data.
  if (!onlyDemo) {
    const get = (path) => fetch(base + path);
    const robots = await (await get('/robots.txt')).text();
    check(robots.includes('Sitemap: https://lucaspadilha.com/sitemap.xml'), 'robots.txt: missing Sitemap line');
    const sitemapResponse = await get('/sitemap.xml');
    const sitemap = await sitemapResponse.text();
    check(sitemapResponse.status === 200, `sitemap.xml: status ${sitemapResponse.status}`);
    for (const path of ['/', '/pt/', '/sites/', '/startup/']) {
      check(sitemap.includes(`<loc>${PROD}${path}</loc>`), `sitemap.xml: missing ${path}`);
    }
    check(!sitemap.includes('/sites/exemplos/'), 'sitemap.xml: lists concept sites (they are noindex)');
    const notFound = await get('/404.html');
    const notFoundHtml = await notFound.text();
    check(notFound.status === 200 && /<meta name="robots" content="noindex/.test(notFoundHtml), '404.html: missing or indexable');

    const { context, page } = await open('/');
    const meta = await page.evaluate(() => ({
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => el.textContent),
    }));
    let person = null;
    try { person = JSON.parse(meta.ld[0] || 'null'); } catch {}
    check(person?.['@type'] === 'Person', `home JSON-LD: ${person?.['@type'] ?? 'missing'}`);
    await context.close();

    for (const path of ['/', '/pt/', ...(routes.some((r) => r.path === '/sites/') ? ['/sites/'] : [])]) {
      const html = await (await get(path)).text();
      const og = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? '';
      const image = await fetch(local(og));
      check(image.status === 200, `${path}: og:image ${og} → ${image.status}`);
      if (image.status === 200) {
        const { width, height } = await sharp(Buffer.from(await image.arrayBuffer())).metadata();
        check(width === 1200 && height === 630, `${path}: og:image is ${width}×${height}`);
      }
    }
  }

  // Content must be visible without JavaScript and with reduced motion.
  for (const [name, options] of [['no-js', { javaScriptEnabled: false }], ['reduced-motion', { reducedMotion: 'reduce' }]]) {
    for (const path of onlyDemo ? [] : ['/', '/pt/']) {
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


