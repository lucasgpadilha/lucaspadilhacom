import sharp from 'sharp';
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Reduce review-only artifacts, keeping original PNGs and full Lighthouse
// reports outside Git. Does not modify production media or audit scores.
const source = resolve(process.env.STARTUP_ARTIFACTS || '../artifacts/nexora-games');
const output = resolve('docs/startup-review');
await mkdir(output, { recursive: true });
for (const width of [360, 390, 768, 1440, 1920]) {
  for (const locale of ['en', 'pt']) {
    await sharp(`${source}/final/${width}-${locale}-hero.png`).jpeg({ quality: 82 }).toFile(`${output}/${width}-${locale}-hero.jpg`);
  }
}
for (const width of [390, 1440]) {
  for (const locale of ['en', 'pt']) await copyFile(`${source}/final/${width}-${locale}-full.jpg`, `${output}/${width}-${locale}-full.jpg`);
}
for (const [width, locale] of [[360, 'en'], [390, 'pt'], [1440, 'en']]) {
  await sharp(`${source}/before/${width}-${locale}-hero.png`).jpeg({ quality: 82 }).toFile(`${output}/before-${width}-${locale}.jpg`);
}
const qa = JSON.parse(await readFile(`${source}/final/checks.json`, 'utf8'));
await writeFile(`${output}/checks.json`, JSON.stringify({ route: '/startup/', viewports: qa.viewports, checks: qa.checks }, null, 2));
const audits = [];
for (const locale of ['en', 'pt']) {
  const audit = JSON.parse(await readFile(`${source}/lighthouse-${locale}.report.json`, 'utf8'));
  audits.push({
    route: `/startup/?lang=${locale}`,
    version: audit.lighthouseVersion,
    fetchedAt: audit.fetchTime,
    formFactor: audit.configSettings.formFactor,
    screen: audit.configSettings.screenEmulation,
    throttlingMethod: audit.configSettings.throttlingMethod,
    throttling: audit.configSettings.throttling,
    scores: Object.fromEntries(Object.entries(audit.categories).map(([key, value]) => [key, value.score * 100])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(key => [key, { value: audit.audits[key].numericValue, unit: audit.audits[key].numericUnit }])),
    failedAccessibilityAudits: audit.categories.accessibility.auditRefs.filter(item => audit.audits[item.id].score === 0).map(item => item.id),
  });
}
await writeFile(`${output}/lighthouse-summary.json`, JSON.stringify(audits, null, 2));
console.log(`Exported compact review evidence to ${output}`);
