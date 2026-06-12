import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const url = process.env.SCREENSHOT_URL ?? 'http://localhost:4321';

await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: 15000,
});

await page.waitForTimeout(6000);
await mkdir('screenshots', { recursive: true });

await page.screenshot({
  path: 'screenshots/hero-1440x900.png',
  fullPage: false,
});

await browser.close();
