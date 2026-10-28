// End-to-end checks for the portfolio, the /sites/ showcase and the concept
// sites. Runs against a production preview: `npm run build && npm run preview`.
import { chromium } from 'playwright';
import sharp from 'sharp';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import { contact, contactHref } from '../src/data/sites.ts';

const base = (process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const PROD = 'https://lucaspadilha.com';
const widths = (process.env.SITE_WIDTHS || '320,360,390,768,1440,1920').split(',').map(Number);
const local = (url) => url.replace(PROD, base);
const shots = process.env.SITE_SHOTS; // optional folder for full-page evidence screenshots
if (shots) await mkdir(shots, { recursive: true });

const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

/** Routes and what every viewport must satisfy. `extra` runs once per route at 390px. */
// Only these repositories are public; private work must never be linked.
const PUBLIC_REPOS = new Set(['lucaspadilhacom', 'pynoc', 'floci-cloud-lab', 'tuildap', 'agent-benchmark']);

// Never on the public site: employers, retired products, internal figures.
const FORBIDDEN = ['MMTech', 'AquiCob', 'Korp', 'Viasoft', 'Comboio', 'Nexora', 'ERP', 'R$ 43', 'Vinhedo', 'process-4', 'apps-k8s'];

/** Headings must carry their own weight: no eyebrow/kicker label right before one (Impeccable ban). */
const eyebrows = () => [...document.querySelectorAll('.label, .kicker, .eyebrow')].filter((el) => {
  const next = el.nextElementSibling;
  return next && (next.matches('h1, h2, h3') || next.firstElementChild?.matches('h1, h2, h3'));
}).length;

async function portfolio(page, label) {
  const facts = await page.evaluate((eyebrowsSrc) => ({
    eyebrows: new Function(`return (${eyebrowsSrc})()`)(),
    steps: document.querySelectorAll('#infra [data-step]').length,
    feats: document.querySelectorAll('#feats li').length,
    side: document.querySelectorAll('#side a[href]').length,
    mail: [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href')),
    repos: [...document.querySelectorAll('a[href^="https://github.com/lucasgpadilha/"]')]
      .map((a) => new URL(a.href).pathname.split('/')[2]),
    text: document.body.textContent,
  }), eyebrows.toString());
  check(facts.eyebrows === 0, `${label}: ${facts.eyebrows} eyebrow labels above headings`);
  check(facts.steps === 5, `${label}: #infra has ${facts.steps} migration steps (expected 5)`);
  check(facts.feats >= 8, `${label}: #feats lists ${facts.feats} things done (expected ≥ 8)`);
  check(facts.side >= 4, `${label}: #side links ${facts.side} side projects (expected ≥ 4)`);
  check(facts.mail.length > 0 && facts.mail.every((m) => m.startsWith('mailto:ceo@lucaspadilha.com')), `${label}: contact e-mail is not ceo@lucaspadilha.com: ${facts.mail.join(', ')}`);
  for (const word of FORBIDDEN) check(!facts.text.includes(word), `${label}: mentions "${word}"`);
  for (const repo of facts.repos) check(PUBLIC_REPOS.has(repo), `${label}: links non-public repo "${repo}"`);
  for (const stale of ['Operational Stack', 'Available for opportunities', 'never straight to main', 'nunca direto na main', 'decide what merges', 'decidem o que entra', 'Reverse-engineered', 'Engenharia reversa', 'reviewed pull requests', 'pull requests revisados']) {
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
  check(facts.bytes < 450 * 1024, `${label}: ${Math.round(facts.bytes / 1024)} KB without images (limit 450 KB)`);
  const text = await page.evaluate(() => ({ banner: document.querySelector('.demo-banner')?.innerText ?? '', body: document.body.textContent }));
  check(/fictícia/i.test(text.banner), `${label}: banner does not say the business is fictional ("${text.banner.replace(/\s+/g, ' ')}")`);
  if (label.includes('/advocacia/')) {
    check(/OAB\/SP/.test(text.body) && /inscrição/i.test(text.body), `${label}: no placeholder for the lawyers' OAB registration`);
    check(!/vinculada ao resultado|mensais|fixos/i.test(text.body), `${label}: advertises fee arrangements (OAB Provimento 205/2021)`);
  }
  if (label.includes('/odontologia/')) {
    check(!/reembolso|parcel|cartão|pix/i.test(text.body), `${label}: advertises payment modalities (CFO)`);
  }
}

async function sitesPage(page, label) {
  const facts = await page.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => { try { return JSON.parse(el.textContent); } catch { return null; } });
    const contacts = [...document.querySelectorAll('a[data-contact]')].map((a) => ({ href: a.getAttribute('href'), channel: a.dataset.contact }));
    return {
      examples: [...document.querySelectorAll('#exemplos a[href^="/sites/exemplos/"]')].map((a) => a.getAttribute('href')),
      wa: document.querySelectorAll('a[href*="wa.me"]').length,
      contacts,
      contato: Boolean(document.getElementById('contato')),
      marketing: Boolean(document.getElementById('marketing')),
      text: document.body.innerText,
      all: document.body.textContent,
      ld: ld.flatMap((item) => (item?.['@graph'] ?? [item]).map((node) => node?.['@type'])),
    };
  });
  const unique = new Set(facts.examples);
  check(unique.size === 3, `${label}: #exemplos links ${unique.size} concept sites (expected 3)`);
  check(facts.contacts.length >= 2, `${label}: only ${facts.contacts.length} contact CTAs`);
  const channels = new Set(facts.contacts.map((c) => c.channel));
  check(channels.size === 1 && (channels.has('email') || channels.has('whatsapp')), `${label}: contact CTAs mix channels: ${[...channels].join(', ')}`);
  const pattern = channels.has('whatsapp') ? /^https:\/\/wa\.me\/\d{12,13}\?text=/ : /^mailto:[^?]+\?subject=/;
  for (const c of facts.contacts) check(pattern.test(c.href), `${label}: contact CTA "${c.href}" does not match its channel`);
  check(channels.has('whatsapp') || facts.wa === 0, `${label}: links wa.me while the channel is e-mail`);
  check(/Wikimedia Commons/.test(facts.text), `${label}: thumbnails show CC BY/BY-SA photos without a credit line`);
  for (const price of ['R$ 470', 'R$ 960', 'R$ 87']) check(facts.all.includes(price), `${label}: missing price ${price}`);
  check(facts.marketing, `${label}: #marketing section missing`);
  if (channels.has('email')) for (const c of facts.contacts) check(c.href.startsWith('mailto:ceo@lucaspadilha.com'), `${label}: contact goes to ${c.href.slice(0, 40)}`);
  for (const word of FORBIDDEN) check(!facts.all.includes(word), `${label}: mentions "${word}"`);
  const brows = await page.evaluate((src) => new Function(`return (${src})()`)(), eyebrows.toString());
  check(brows === 0, `${label}: ${brows} eyebrow labels above headings`);
  check(facts.contato, `${label}: #contato missing`);
  check(facts.ld.includes('ProfessionalService'), `${label}: JSON-LD types ${facts.ld.join(', ')}`);
}

const DEMOS = ['advocacia', 'odontologia', 'cafe'];
const onlyDemo = process.env.SITE_DEMO;

const routes = [
  { path: '/', lang: 'en', extra: portfolio },
  { path: '/pt/', lang: 'pt-BR', extra: portfolio },
  { path: '/sites/', lang: 'pt-BR', extra: sitesPage },
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
      if (width === 390) {
        await page.waitForTimeout(300);
        const more = await page.evaluate(() => {
          const endless = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity);
          const executable = (el) => !el.type || ['module', 'text/javascript', 'application/javascript'].includes(el.type);
          const inline = [...document.scripts].filter((el) => !el.src && executable(el)).reduce((sum, el) => sum + el.textContent.length, 0);
          const external = performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'script').reduce((sum, r) => sum + (r.transferSize || r.encodedBodySize || 0), 0);
          const shown = document.querySelector('[data-js]')?.textContent ?? '';
          return {
            endless: endless.map((a) => a.animationName || a.effect?.target?.className || 'animation'),
            badCaptions: [...document.querySelectorAll('figcaption')].filter((f) => f.parentElement?.tagName !== 'FIGURE').length,
            receiptJs: shown ? Number(shown.replace(/[^\d,.]/g, '').replace(',', '.')) : null,
            realJsKb: (inline + external) / 1024,
          };
        });
        check(more.endless.length === 0, `${label}: endless animations without a pause control (WCAG 2.2.2): ${more.endless.join(', ')}`);
        check(more.badCaptions === 0, `${label}: ${more.badCaptions} figcaption outside a figure`);
        if (more.receiptJs !== null) check(Math.abs(more.receiptJs - more.realJsKb) <= 0.15, `${label}: receipt says ${more.receiptJs} KB of JS, page runs ${more.realJsKb.toFixed(2)} KB`);
      }
      if (width === 390 && route.extra) await route.extra(page, label);
      if (width === 390 || width === 1440) {
        // Scroll-reveal starts hidden; show everything so axe judges the final state.
        await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
        await page.waitForTimeout(800);
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        for (const v of axe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')) {
          check(false, `${label}: axe ${v.id} (${v.impact}) — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
        }
        if (shots) {
          const name = `${route.path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home-en'}-${width}.png`;
          await page.screenshot({ path: `${shots}/${name}`, fullPage: true });
        }
      }
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
    {
      name: 'pt browser, blocked storage, EN chosen, reload', path: '/?lang=en', expect: '/', reload: true,
      options: { locale: 'pt-BR', init: () => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }) },
    },
    {
      name: 'pt browser, blocked storage, /pt/?lang=en#contact', path: '/pt/?lang=en#contact', expect: '/#contact',
      options: { locale: 'pt-BR', init: () => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }) },
    },
    { name: 'other query params survive the redirect', path: '/?utm_source=cv#work', options: { locale: 'pt-BR' }, expect: '/pt/#work', search: '?utm_source=cv' },
    { name: 'other params survive ?lang=en', path: '/pt/?lang=en&ref=cv', options: { locale: 'pt-BR' }, expect: '/', search: '?ref=cv' },
  ];
  for (const item of localeCases) {
    const { context, page, errors } = await open(item.path, item.options);
    await page.waitForLoadState('load');
    if (item.reload) { await page.reload(); await page.waitForLoadState('load'); }
    const url = new URL(page.url());
    check(url.pathname + url.hash === item.expect, `locale "${item.name}": landed on ${url.pathname}${url.search}${url.hash}`);
    if (item.search !== undefined) check(url.search === item.search, `locale "${item.name}": query is "${url.search}" (expected "${item.search}")`);
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
    for (const path of ['/', '/pt/', '/sites/']) {
      check(sitemap.includes(`<loc>${PROD}${path}</loc>`), `sitemap.xml: missing ${path}`);
    }
    check(!sitemap.includes('/startup/'), 'sitemap.xml: lists /startup/ (it stays online but unlisted)');
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

  if (!onlyDemo) {
    for (const path of ['/', '/pt/', '/sites/']) {
      const { context, page } = await open(path);
      await page.emulateMedia({ media: 'print' });
      const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => Number(getComputedStyle(el).opacity) < 1).length);
      check(hidden === 0, `print ${path}: ${hidden} blocks invisible when printed`);
      await context.close();
    }
    const { context, page } = await open('/', { viewport: { width: 390, height: 844 } });
    const menu = page.locator('details.menu');
    await menu.locator('summary').click();
    await menu.locator('nav a[href="#infra"]').click();
    check(!(await menu.evaluate((el) => el.open)), 'mobile menu stays open after choosing a section');
    await menu.locator('summary').click();
    await page.keyboard.press('Escape');
    check(!(await menu.evaluate((el) => el.open)), 'mobile menu does not close on Escape');
    await context.close();

    const saved = contact.whatsapp;
    contact.whatsapp = '+55 (19) 99999-0000';
    check(contactHref('oi').startsWith('https://wa.me/5519999990000?text='), `contactHref does not sanitize the WhatsApp number: ${contactHref('oi')}`);
    contact.whatsapp = 'a definir';
    check(contactHref('oi').startsWith('mailto:'), `contactHref with an invalid number: ${contactHref('oi')}`);
    contact.whatsapp = saved;
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


