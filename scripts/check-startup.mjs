import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.STARTUP_PREVIEW_URL || 'http://127.0.0.1:4322';
const output = resolve(process.env.STARTUP_QA_OUTPUT || '../artifacts/nexora-games/final');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const sizes = [[360, 640], [390, 844], [768, 1024], [1440, 900], [1920, 1080]];
const report = { base, viewports: [], checks: [] };
try {
  for (const [width, height] of sizes) {
    for (const locale of ['en', 'pt']) {
      const context = await browser.newContext({ viewport: { width, height }, locale: 'en-US', deviceScaleFactor: 1 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      const response = await page.goto(`${base}/startup/?lang=${locale}`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${output}/${width}-${locale}-hero.png` });
      // Trigger native lazy loading before making the full-page evidence.
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        // Screenshots must also contain offscreen horizontal slides. This is a
        // test-only override; production keeps native lazy loading intact.
        await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode(); }));
        for (let y = 0; y < document.body.scrollHeight; y += 550) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        document.querySelectorAll('.gallery-rail').forEach(el => el.scrollLeft = el.scrollWidth);
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => { document.querySelector('.gallery-rail').scrollLeft = 0; window.scrollTo(0, 0); document.documentElement.style.removeProperty('scroll-behavior'); });
      await page.waitForTimeout(600);
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${output}/${width}-${locale}-full.jpg`, fullPage: true, type: 'jpeg', quality: 85 });
      const state = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll('h1').length,
        brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
        islands: document.querySelectorAll('astro-island').length,
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        description: document.querySelector('meta[name="description"]')?.content,
        ogImage: document.querySelector('meta[property="og:image"]')?.content,
      }));
      assert.equal(state.lang, locale === 'pt' ? 'pt-BR' : 'en');
      assert.equal(state.overflow, false, `Horizontal overflow at ${width}/${locale}`);
      assert.equal(state.h1, 1);
      assert.deepEqual(state.brokenImages, []);
      assert.equal(state.islands, 0);
      assert.equal(state.canonical, 'https://lucaspadilha.com/startup/');
      assert.ok(state.description && state.ogImage.endsWith('/startup/og-nexora.jpg'));
      assert.ok(await page.locator('meta[name="twitter:card"]').getAttribute('content') === 'summary_large_image');
      assert.deepEqual(await page.locator('img[data-alt-en]').evaluateAll(images => images.map(img => img.alt === img.dataset[document.documentElement.lang === 'pt-BR' ? 'altPt' : 'altEn'])), Array(6).fill(true));
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash)), []);
      assert.deepEqual(errors, []);
      report.viewports.push({ width, height, locale, ...state, errors });
      await context.close();
    }
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
  const page = await context.newPage();
  await page.goto(`${base}/startup`);
  assert.equal(await page.locator('h1').innerText(), 'NEXORA\nGAMES');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('href'), '#main');
  assert.notEqual(await page.locator(':focus').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  report.checks.push('Direct /startup navigation, skip link and visible keyboard focus');
  await page.locator('[data-locale="pt"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  assert.equal(new URL(page.url()).searchParams.get('lang'), 'pt');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  await page.goto(`${base}/startup/`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
  await page.goto(`${base}/`);
  await page.waitForFunction(() => document.documentElement.lang === 'pt-BR');
  await page.goto(`${base}/startup/?lang=en`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  report.checks.push('EN/PT query override, buttons, refresh, shared preference and portfolio navigation');
  assert.equal(await page.locator('.contact-email').getAttribute('href'), 'mailto:ceo@lucaspadilha.com');
  assert.equal(await page.locator('.founder .text-link').getAttribute('href'), '/');
  for (const path of ['/startup/favicon.svg', '/startup/fonts/OFL.txt', '/startup/og-nexora.jpg']) assert.equal((await page.request.get(`${base}${path}`)).status(), 200);
  await page.locator('.gallery-index a[href="#scene-subida"]').click();
  await page.waitForTimeout(700);
  assert.ok(await page.locator('.gallery-rail').evaluate(el => el.scrollLeft > 0));
  await page.locator('.gallery-rail').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  report.checks.push('Contact/portfolio destinations and native keyboard-accessible gallery');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.hero-composition').evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
  report.checks.push('Reduced motion disables opening animation and smooth scrolling');
  await context.close();

  const portuguese = await browser.newContext({ locale: 'pt-BR' });
  const ptPage = await portuguese.newPage();
  await ptPage.goto(`${base}/startup/`);
  assert.equal(await ptPage.locator('html').getAttribute('lang'), 'pt-BR');
  await portuguese.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(`${base}/startup/`);
  assert.equal(await staticPage.locator('html').getAttribute('lang'), 'en');
  assert.ok((await staticPage.locator('.hero-description').innerText()).includes('Comboio Bruto'));
  await noScript.close();
  report.checks.push('Browser-language detection and readable static English without JavaScript');
  await writeFile(`${output}/checks.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: true, viewports: report.viewports.length, checks: report.checks, output }, null, 2));
} finally {
  await browser.close();
}
