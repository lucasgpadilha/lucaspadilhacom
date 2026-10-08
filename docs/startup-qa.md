# Nexora Games — delivery and QA

Validated on 2026-10-08, using the built static output and Chromium 148 through Playwright 1.60.0. The new route has zero hydrated React islands; its small inline scripts handle locale detection and selection only.

## Visual iterations

The first complete build was captured and inspected, not merely compiled. Its three most important visual problems were:

1. At 360×640, body copy pushed the first actual truck below the opening screen. Move the image ahead of the supporting paragraph on mobile and tune its crop. [Before](startup-review/before-360-en.jpg) / [after](startup-review/360-en-hero.jpg).
2. At 1440×900, the tall hero hid the prototype caption below the viewport. Reduce wordmark/image height and spacing without losing the asymmetry. [Before](startup-review/before-1440-en.jpg) / [after](startup-review/1440-en-hero.jpg).
3. Portuguese contact text wrapped the secondary CTA into an accidental extra row. Give that action a short, meaningful label and keep both CTAs on one row. Also remove the introduction's narrow measure, which stranded “Brasil.” [Before](startup-review/before-390-pt.jpg) / [after](startup-review/390-pt-hero.jpg).

Repeated capture/inspection after fixes. The final opening composition, heading wraps, image crops, section rhythm and contact/footer were inspected at all five requested viewports. No obvious high-impact defect remains in those tested views.

| Viewport | English | Português |
|---|---|---|
| 360×640 | [Hero](startup-review/360-en-hero.jpg) | [Hero](startup-review/360-pt-hero.jpg) |
| 390×844 | [Hero](startup-review/390-en-hero.jpg), [full page](startup-review/390-en-full.jpg) | [Hero](startup-review/390-pt-hero.jpg), [full page](startup-review/390-pt-full.jpg) |
| 768×1024 | [Hero](startup-review/768-en-hero.jpg) | [Hero](startup-review/768-pt-hero.jpg) |
| 1440×900 | [Hero](startup-review/1440-en-hero.jpg), [full page](startup-review/1440-en-full.jpg) | [Hero](startup-review/1440-pt-hero.jpg), [full page](startup-review/1440-pt-full.jpg) |
| 1920×1080 | [Hero](startup-review/1920-en-hero.jpg) | [Hero](startup-review/1920-pt-hero.jpg) |

Original PNGs and full Lighthouse JSON/HTML reports remain in the owner's local artifacts directory, outside Git. The committed evidence contains compressed screenshots and unmodified measured scores/settings in a compact JSON summary.

## Build and browser checks

- `npm ci`: passed; no dependency additions or lockfile changes.
- `npm run build`: passed; generates both `dist/index.html` and `dist/startup/index.html`.
- `npm run preview`: tested against production output.
- `npm run test:startup`: passed all 10 viewport/locale combinations; no horizontal document overflow, broken images, missing anchor targets, JavaScript exceptions or HTTP asset errors on `/startup/`.
- Checked query overrides, browser-language detection, selector buttons, persisted language across refresh/navigation and shared portfolio storage key.
- Checked skip-to-content focus, visible keyboard outlines, gallery anchors/keyboard access, contact/portfolio links, translated alt text, title/description/canonical/social preview, favicon and font license URLs.
- Reduced motion removes opening animation and smooth scrolling; no autoplay media. Static English remains readable with JavaScript disabled.
- Existing screenshot command also ran successfully against `/`.

[Machine-readable checks](startup-review/checks.json).

## Lighthouse mobile

Lighthouse 13.5.0, default simulated mobile throttling (4× CPU slowdown, 150 ms RTT), 412×823 / DPR 1.75, local production preview. These are controlled lab results, not production field measurements or a guarantee of full WCAG conformance.

| Locale | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| EN | 99 | 100 | 100 | 2.18 s | 0 ms | 0 |
| PT | 99 | 100 | 100 | 2.18 s | 0 ms | 0 |

All requested ≥90 targets passed. An earlier audit scored 98/100/100 but still found a non-score-weighted label/name mismatch on locale buttons. That issue was fixed and both locales re-audited; the final label/name check passes. Further gallery image sizing/compression remains an optional performance refinement, not a missing required feature.

[Measured settings, timestamps and metrics](startup-review/lighthouse-summary.json). Re-run with the official [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli), using an installed Chromium and `--only-categories=performance,accessibility,seo --output=json --output=html`.

## Vercel guideline review

Fresh [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) fetched and read in full for the final source review.

```text
src/pages/startup.astro:17 — fixed: accessible locale names include visible EN/PT labels.
src/pages/startup.astro:20 — fixed: site footer outside main, proper contentinfo landmark.
src/styles/startup.css:26 — fixed: brand/credit links have hover feedback; keyboard focus preserved.
src/components/startup/Hero.astro — pass: caption/alt, dimensions, srcset, high-priority image, real links.
src/components/startup/Game.astro — pass: ordered participation, lazy images, native scroll + anchor alternatives.
src/components/startup/Studio.astro — pass: hierarchical headings, explicit roadmap states.
src/components/startup/Contact.astro — pass: direct contact and real founder/portfolio.
src/components/startup/Footer.astro — pass: native disclosure, credits and contact navigation.
src/components/startup/Text.astro / Mark.astro — pass: language spans; decorative SVG hidden.
src/layouts/StartupLayout.astro — pass: route metadata, font preload/swap, language detection without IP.
src/styles/startup.css — pass: scoped theme, contrast, ≥44 px main targets, reduced motion, no transition:all.
```

Content follows the brief and Anthropic's sentence-case/conversational direction rather than Vercel's generic title-case copy recommendation. Forms, drag interfaces, destructive actions and video controls are not present.

## Portfolio regression and static routing

Built the untouched `main` at `4f146e62058584479b0884cfa950eb0aa9f410a4` in a separate temporary directory using the same installed dependencies. All 21 existing CSS/JS/public files are byte-identical. The generated homepage HTML is identical after normalizing build-specific Astro island `uid` attributes. Existing homepage source, layout, React components, global CSS, locale module and deployment workflow are untouched.

The only integration adjustment disables redundant automatic Tailwind base injection: the portfolio already imports all Tailwind layers in `globals.css`. This prevents a second global stylesheet from being attached to `/` when adding another layout; `/startup/` uses its own scoped reset/styles.

`/` returns 200 and renders in EN/PT with no local asset failures. Portuguese produces React hydration warning #418, reproduced in the untouched main build as well. This is a pre-existing issue, not a startup-route regression; [React documents #418](https://react.dev/errors/418) as a server/client hydration mismatch. It is intentionally not fixed here because the brief prohibits homepage changes.

Direct `/startup` and `/startup/` navigation and refresh work in the production preview. Inspection found Caddy `file_server`, not Nginx, in the existing Ansible configuration; the live site's read-only response headers also identify Caddy. The generated directory/index structure fits that existing static setup. No SPA fallback, server runtime, infrastructure/DNS change or new deployment step is needed. The live `/startup/` must be checked after the owner approves and the existing deployment runs; it has not been deployed during this task.

## Known limits and release approval

- Automated accessibility checks plus manual keyboard/visual review are not a complete assistive-technology audit. Safari/Firefox and physical devices were not tested.
- Localization is client-side, like the existing static portfolio. Without JavaScript, readers and social crawlers get the complete English fallback, including on `?lang=pt`.
- Asset licenses and required attribution were checked; private acquisition receipts were not inspected. See [media provenance](startup-media.md); the owner should retain those records and approve the public captures before merging.
- Existing dependency audit: 20 findings (4 moderate, 15 high, 1 critical), present before this work. No unrelated package upgrades were made; remediation should be a separate scoped change.
- No public play link, invented team, funding, adoption numbers or Anthropic partnership claim. Claude remains explicitly planned.
- Owner approval is required before merge: `main` triggers production deployment. This branch/PR is for review only.

## Reproduction

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4322
# In another terminal, after installing Playwright Chromium/dependencies:
npm run test:startup
node scripts/export-startup-evidence.mjs
```

Use `STARTUP_PREVIEW_URL` / `STARTUP_QA_OUTPUT` to customize testing. Evidence export expects the before/final captures and Lighthouse reports under the configured `STARTUP_ARTIFACTS` directory. Asset preparation is optional and requires the owner's private sibling folders; ordinary builds use only committed public renders/fonts.
