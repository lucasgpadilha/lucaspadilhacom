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
    steps: document.querySelectorAll('#kubernetes [data-step]').length,
    ops: document.querySelectorAll('#operations article').length,
    legend: document.querySelectorAll('[data-legend] details[data-part]').length,
    deploy: document.querySelectorAll('[data-deploy] svg path').length,
    chapters: ['#cloud', '#platform', '#kubernetes', '#delivery', '#finops', '#operations', '#observability', '#data', '#automation', '#how'].filter((id) => !document.querySelector(id)),
    drawings: ['[data-scenario] svg', '#cloud svg', '#platform svg', '#kubernetes svg', '#delivery svg', '#finops svg'].filter((sel) => !document.querySelector(sel)),
    side: document.querySelectorAll('#side a[href]').length,
    mail: [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href')),
    repos: [...document.querySelectorAll('a[href^="https://github.com/lucasgpadilha/"]')]
      .map((a) => new URL(a.href).pathname.split('/')[2]),
    text: document.body.textContent,
  }), eyebrows.toString());
  check(facts.eyebrows === 0, `${label}: ${facts.eyebrows} eyebrow labels above headings`);
  check(facts.steps === 5, `${label}: #kubernetes shows ${facts.steps} method steps (expected 5)`);
  check(facts.ops === 3, `${label}: #operations shows ${facts.ops} blocks (expected 3)`);
  check(facts.legend === 8, `${label}: the hero legend has ${facts.legend} parts (expected 8)`);
  check(facts.deploy > 40, `${label}: the hero deploy drawing is missing from the HTML (${facts.deploy} paths)`);
  check(facts.chapters.length === 0, `${label}: missing chapters ${facts.chapters.join(', ')}`);
  check(facts.drawings.length === 0, `${label}: chapters without their drawing in the HTML: ${facts.drawings.join(', ')}`);
  for (const price of ['R$ 470', 'R$ 960', 'R$ 87']) check(facts.text.includes(price), `${label}: missing price ${price}`);
  check(facts.side >= 4, `${label}: #side links ${facts.side} side projects (expected ≥ 4)`);
  check(facts.mail.length > 0 && facts.mail.every((m) => m.startsWith('mailto:ceo@lucaspadilha.com')), `${label}: contact e-mail is not ceo@lucaspadilha.com: ${facts.mail.join(', ')}`);
  for (const word of FORBIDDEN) check(!facts.text.includes(word), `${label}: mentions "${word}"`);
  for (const repo of facts.repos) check(PUBLIC_REPOS.has(repo), `${label}: links non-public repo "${repo}"`);
  check(/Wikimedia Commons/.test(facts.text), `${label}: demo thumbnails show CC BY/BY-SA photos without a credit line`);
  for (const stale of ['Infraestrutura de cloud como código na OCI', 'O que eu faço', 'Rede e clusters como código', 'Role para rodar', 'Scroll to run it', 'De cinco VMs a um cluster', 'From five VMs to one', 'it was emptied and shut down', 'era esvaziada e desligada', 'Tools I use every day', 'Ferramentas do dia a dia', 'About 380 thousand events a day rerouted', 'Cerca de 380 mil envios por dia tirados', 'Operational Stack', 'Available for opportunities', 'never straight to main', 'nunca direto na main', 'decide what merges', 'decidem o que entra', 'Reverse-engineered', 'Engenharia reversa', 'reviewed pull requests', 'pull requests revisados']) {
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
  const previews = await page.evaluate(() => [...document.querySelectorAll('#exemplos video')].map((v) => ({
    preload: v.getAttribute('preload'), poster: Boolean(v.getAttribute('poster')), loop: v.loop, muted: v.muted,
    button: v.closest('figure')?.querySelector('button[aria-pressed]') !== null,
  })));
  check(previews.length === 3, `${label}: ${previews.length} video previews (expected 3)`);
  for (const v of previews) check(v.preload === 'none' && v.poster && !v.loop && v.muted && v.button, `${label}: preview must be preload=none, poster, no loop, muted, with a pause button: ${JSON.stringify(v)}`);
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
  const { init, using = browser, ...contextOptions } = options;
  const context = await using.newContext({ locale: 'en-US', ...contextOptions });
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
      if (width === 1440 && (await page.locator('[data-scene]').count())) {
        const host = page.locator('[data-scene]').first();
        await host.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        if ((await host.getAttribute('data-scene')) === 'idle') {
          const still = await page.evaluate(() => {
            const fallback = document.querySelector('[data-scene] [data-fallback]');
            return fallback ? Number(getComputedStyle(fallback).opacity) : -1;
          });
          check(still >= 0.9, `${label}: scene waits for interaction but its still is invisible (opacity ${still})`);
        }
        await page.mouse.move(8, 8); // scenes may wait for the first interaction
        await page.waitForFunction(() => ['live', 'fallback'].includes(document.querySelector('[data-scene]')?.dataset.scene), null, { timeout: 15000 }).catch(() => {});
        const state = await host.getAttribute('data-scene');
        check(state === 'live', `${label}: scene is "${state}" (expected live where WebGL works)`);
        if (state === 'live') {
          const webgl = await page.evaluate(() => {
            const canvas = document.querySelector('[data-scene] canvas');
            return Boolean(canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
          });
          check(webgl, `${label}: scene canvas has no WebGL context`);
          await page.mouse.move(1, 1);
          await page.waitForTimeout(1500);
          const before = await host.screenshot();
          await page.waitForTimeout(6000);
          const after = await host.screenshot();
          check(before.equals(after), `${label}: the scene keeps moving on its own after 5 s (WCAG 2.2.2)`);
        }
      }
      if (width === 390 || width === 1440) {
        // Scroll-reveal starts hidden; show everything so axe judges the final state.
        await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
        await page.waitForTimeout(800);
        // Judge the settled page: the hero run dims labels for its first second or so.
        await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), null, { timeout: 8000 }).catch(() => {});
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
      const paused = await page.evaluate(() => document.querySelectorAll('[data-scenario], [data-deploy], [data-migrate], [data-cloud], [data-finops]').length
        ? [...document.querySelectorAll('[data-scenario] *, [data-deploy] *, [data-migrate] *, [data-cloud] *, [data-finops] *')].filter((el) => getComputedStyle(el).animationName !== 'none').length
        : 0);
      check(paused === 0, `print ${path}: ${paused} drawing parts still animated (they would print on their first frame)`);
      await context.close();
    }
    const { context, page } = await open('/', { viewport: { width: 390, height: 844 } });
    const menu = page.locator('details.menu');
    await menu.locator('summary').click();
    await menu.locator('nav a[href="#cloud"]').click();
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

  const noWebGL = await chromium.launch({ args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] });
  const webgl1 = await chromium.launch({ args: ['--disable-webgl2'] });
  try {
    for (const route of routes) {
      for (const [name, options] of [['reduced motion', { reducedMotion: 'reduce' }], ['no WebGL', { using: noWebGL }], ['WebGL1 only', { using: webgl1 }]]) {
        const { context, page, errors } = await open(route.path, { viewport: { width: 1440, height: 900 }, ...options });
        if (await page.locator('[data-scene]').count()) {
          await page.locator('[data-scene]').first().scrollIntoViewIfNeeded();
          await page.mouse.move(8, 8);
          await page.waitForTimeout(1200);
          const facts = await page.evaluate(() => {
            const host = document.querySelector('[data-scene]');
            const fallback = host.querySelector('[data-fallback]');
            return { state: host.dataset.scene, canvas: Boolean(host.querySelector('canvas')), shown: Boolean(fallback && !fallback.hidden && fallback.getBoundingClientRect().height > 0), opacity: fallback ? Number(getComputedStyle(fallback).opacity) : -1 };
          });
          check(facts.state === 'fallback' && !facts.canvas && facts.shown && facts.opacity >= 0.9, `${route.path} (${name}): expected the static fallback, got ${JSON.stringify(facts)}`);
          check(errors.length === 0, `${route.path} (${name}): ${errors.join(' | ')}`);
        }
        await context.close();
      }
    }
  } finally {
    await noWebGL.close();
    await webgl1.close();
  }

  if (!onlyDemo) {
    const { context, page } = await open('/', { viewport: { width: 1440, height: 900 } });
    const theme = () => page.evaluate(() => document.documentElement.dataset.theme || 'paper');
    const at = async (selector) => { await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center', behavior: 'instant' }), selector); await page.waitForTimeout(500); return theme(); };
    const top = await theme();
    const night = await at('#operations');
    const paper = await at('#contact');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(500);
    const back = await theme();
    check(top === 'night' && night === 'night' && paper === 'paper' && back === 'night', `theme shift: top=${top}, operations=${night}, contact=${paper}, back=${back}`);
    // Density: the v3 home was 10,300px tall with ~90px section titles.
    const size = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      h2: Math.max(...[...document.querySelectorAll('main h2')].map((h) => parseFloat(getComputedStyle(h).fontSize))),
    }));
    check(size.height <= 8000, `home @1440: ${size.height}px tall (budget 8000)`);
    check(size.h2 <= 44, `home @1440: a section title is ${size.h2}px (max 44)`);
    await context.close();

    // The hero deploy runs once, settles within 5 s, and the blocked run stops at the gate.
    for (const [name, options] of [['motion', {}], ['reduced motion', { reducedMotion: 'reduce' }]]) {
      const { context: ctx, page: p, errors } = await open('/pt/', { viewport: { width: 1440, height: 900 }, ...options });
      const stage = p.locator('[data-deploy] .stage');
      await p.evaluate(() => document.querySelector('[data-deploy]').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await p.waitForTimeout(5600); // the run starts when the drawing is in view and lasts under 5 s
      const running = await p.evaluate(() => document.querySelector('[data-deploy]').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length);
      check(running === 0, `deploy (${name}): ${running} animations still running after 5 s`);
      const a = await stage.screenshot();
      await p.waitForTimeout(1200);
      check(a.equals(await stage.screenshot()), `deploy (${name}): the drawing still moves after 5 s`);
      await p.locator('[data-run="blocked"]').click();
      await p.waitForTimeout(3200);
      const blocked = await p.evaluate(() => {
        const fig = document.querySelector('[data-deploy]');
        const visible = (sel) => { const el = fig.querySelector(sel); return el && getComputedStyle(el).display !== 'none' && Number(getComputedStyle(el).opacity) > 0.5; };
        return { msg: visible('.msg.blocked'), clean: visible('.msg.clean'), fresh: Number(getComputedStyle(fig.querySelector('.fresh')).opacity), pressed: fig.querySelector('[data-run="blocked"]').hasAttribute('data-active') };
      });
      check(blocked.msg && !blocked.clean && blocked.fresh === 0 && blocked.pressed, `deploy (${name}): blocked run ${JSON.stringify(blocked)}`);
      await p.locator('[data-run="clean"]').click();
      await p.waitForTimeout(5200);
      const clean = await p.evaluate(() => getComputedStyle(document.querySelector('[data-deploy] .msg.clean')).display);
      check(clean !== 'none', `deploy (${name}): clean run does not end healthy`);
      check(errors.length === 0, `deploy (${name}): ${errors.join(' | ')}`);
      await ctx.close();
    }
  }

  // The hero map: assembles on load, settles within 5 s, and the legend drives it.
  if (!onlyDemo) {
    for (const [name, options] of [['motion', {}], ['reduced motion', { reducedMotion: 'reduce' }], ['phone', { viewport: { width: 390, height: 844 } }]]) {
      const { context: ctx, page: p, errors } = await open('/pt/', { viewport: { width: 1440, height: 900 }, ...options });
      await p.waitForTimeout(5000);
      const running = await p.evaluate(() => document.querySelector('[data-scenario]').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length);
      check(running === 0, `scenario (${name}): ${running} animations still running after 5 s`);
      await p.locator('details[data-part="delivery"] summary').click();
      await p.waitForTimeout(400);
      const focus = await p.evaluate(() => {
        const fig = document.querySelector('[data-scenario]');
        const lit = [...fig.querySelectorAll('.part[data-part="delivery"]')].every((el) => Number(getComputedStyle(el).opacity) === 1);
        const dim = [...fig.querySelectorAll('.part[data-part="network"]')].every((el) => Number(getComputedStyle(el).opacity) < 0.5);
        return { key: fig.dataset.focus, lit, dim, link: document.querySelector('details[data-part="delivery"][open] a[href="#delivery"]') !== null };
      });
      check(focus.key === 'delivery' && focus.lit && focus.dim && focus.link, `scenario (${name}): legend does not drive the map ${JSON.stringify(focus)}`);
      await p.locator('details[data-part="delivery"] summary').click();
      await p.waitForTimeout(400);
      check(await p.evaluate(() => !document.querySelector('[data-scenario]').dataset.focus), `scenario (${name}): closing the part leaves the map dimmed`);
      check(errors.length === 0, `scenario (${name}): ${errors.join(' | ')}`);
      await ctx.close();
    }
  }

  // The chapter drawings play once on entering the viewport, settle within 5 s and hold.
  if (!onlyDemo) {
    for (const [name, options] of [['motion', {}], ['reduced motion', { reducedMotion: 'reduce' }]]) {
      const { context: ctx, page: p, errors } = await open('/pt/', { viewport: { width: 1440, height: 900 }, ...options });
      for (const sel of ['[data-migrate]', '[data-cloud]', '[data-finops]', '[data-deploy]']) {
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel);
        await p.waitForTimeout(5500);
        const running = await p.evaluate((s) => document.querySelector(s).getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length, sel);
        check(running === 0, `${sel} (${name}): ${running} animations still running 5.5 s after it came into view`);
        const a = await p.locator(sel).screenshot();
        await p.waitForTimeout(1000);
        check(a.equals(await p.locator(sel).screenshot()), `${sel} (${name}): still moving after it settled`);
      }
      // Rollback: the last phase goes back to Docker and its VM stays on.
      await p.evaluate(() => document.querySelector('[data-migrate]').scrollIntoView({ block: 'center', behavior: 'instant' }));
      await p.locator('[data-migrate] [data-mode="rollback"]').click();
      await p.waitForTimeout(2800);
      const rollback = await p.evaluate(() => {
        const fig = document.querySelector('[data-migrate]');
        const op = (sel) => Number(getComputedStyle(fig.querySelector(sel)).opacity);
        return {
          pods: op('.pod.n2'), vm: op('.vm.v2 .run'), wire: op('.to-vm.v2 .live'),
          msg: getComputedStyle(fig.querySelector('.msg.rollback')).display !== 'none',
          running: fig.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
        };
      });
      check(rollback.pods === 0 && rollback.vm === 1 && rollback.wire === 1 && rollback.msg && rollback.running === 0, `migration rollback (${name}): ${JSON.stringify(rollback)}`);
      await p.locator('[data-migrate] [data-mode="clean"]').click();
      await p.waitForTimeout(4800);
      const clean = await p.evaluate(() => { const fig = document.querySelector('[data-migrate]'); return [...fig.querySelectorAll('.pod')].every((el) => Number(getComputedStyle(el).opacity) === 1) && Number(getComputedStyle(fig.querySelector('.vm.v2 .run')).opacity) === 0; });
      check(clean, `migration clean run (${name}): pods not all up or a VM still running`);

      // Telemetry route: Before lights the public round trip, After the internal path.
      for (const route of ['before', 'after']) {
        await p.evaluate(() => document.querySelector('[data-cloud]').scrollIntoView({ block: 'center', behavior: 'instant' }));
        await p.locator(`[data-cloud] [data-route="${route}"]`).click();
        await p.waitForTimeout(4600);
        const state = await p.evaluate((r) => {
          const fig = document.querySelector('[data-cloud]');
          const msg = fig.querySelector('.msg');
          return {
            pressed: fig.querySelector(`[data-route="${r}"]`).getAttribute('aria-pressed'),
            caption: msg.textContent.trim() === msg.dataset[r],
            mode: fig.classList.contains(`is-${r}`),
            running: fig.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
          };
        }, route);
        check(state.pressed === 'true' && state.caption && state.mode && state.running === 0, `telemetry route ${route} (${name}): ${JSON.stringify(state)}`);
      }
      check(errors.length === 0, `chapters (${name}): ${errors.join(' | ')}`);
      await ctx.close();
    }
  }

  // The sales funnel's main click: /sites/ → a concept site, with no errors along the way.
  if (!onlyDemo) {
    for (const slug of DEMOS) {
      const { context, page, errors } = await open('/sites/', { viewport: { width: 1440, height: 900 } });
      await Promise.all([page.waitForURL(`**/sites/exemplos/${slug}/`), page.locator(`#exemplos a[href="/sites/exemplos/${slug}/"]`).first().click()]);
      await page.waitForTimeout(1200);
      check(errors.length === 0, `navigate /sites/ → ${slug}: ${errors.join(' | ')}`);
      await context.close();
    }
  }

  // Video previews never start on their own under reduced motion.
  if (!onlyDemo) {
    const { context, page } = await open('/sites/', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.evaluate(() => document.querySelector('#exemplos').scrollIntoView({ behavior: 'instant' }));
    await page.waitForTimeout(1500);
    const playing = await page.evaluate(() => [...document.querySelectorAll('#exemplos video')].filter((v) => !v.paused).length);
    check(playing === 0, `/sites/ (reduced motion): ${playing} previews playing on their own`);
    await context.close();
  }

  // The hero headline reveal finishes fast and leaves the title readable; pages cross-fade natively.
  if (!onlyDemo) {
    for (const path of ['/', '/pt/']) {
      const { context, page } = await open(path, { viewport: { width: 1440, height: 900 } });
      await page.waitForTimeout(1500);
      const hero = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const parts = [...h1.querySelectorAll('*')];
        const moved = parts.filter((el) => {
          const t = getComputedStyle(el).transform;
          return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
        }).length;
        const vt = [...document.styleSheets].some((sheet) => {
          try { return [...sheet.cssRules].some((rule) => rule.cssText.includes('@view-transition')); } catch { return false; }
        });
        return { opacity: Number(getComputedStyle(h1).opacity), visibility: getComputedStyle(h1).visibility, moved, text: h1.textContent.trim().length, vt, reveals: document.querySelectorAll('[data-reveal]').length };
      });
      check(hero.opacity === 1 && hero.visibility === 'visible' && hero.moved === 0 && hero.text > 20, `hero ${path}: headline not settled after 1.5 s ${JSON.stringify(hero)}`);
      check(hero.vt, `hero ${path}: no @view-transition rule`);
      check(hero.reveals === 0, `hero ${path}: ${hero.reveals} blocks still use the generic scroll reveal`);
      await context.close();
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


