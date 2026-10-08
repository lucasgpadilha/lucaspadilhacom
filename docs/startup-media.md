# Nexora Games — public media provenance

Public assets are rendered still images only, optimized into WebP at 360/720/1080 px. They contain sample/QA driver names, not identifiable real viewers. No private source, model, texture archive, metrics, accounts, database, footage of real chat or paid service credentials are distributed.

| Public asset | Source | Treatment |
|---|---|---|
| `hero-*` | Existing Godot capture `apps/live-overlay/public/review/serra-starter.png` | Resize/WebP; presentation crop in CSS |
| `serra-*` | Owner supplied `mockups/01-serra.jpg` | Resize/WebP, original HUD retained |
| `sertao-*` | Owner supplied `mockups/02-sertao.jpg` | Resize/WebP, original HUD retained |
| `noite-*` | Owner supplied `mockups/03-estrada-noturna.jpg` | Resize/WebP, original HUD retained |
| `patio-*` | Owner supplied `mockups/04-patio.jpg` | Resize/WebP, original HUD retained |
| `subida-*` | Owner supplied `mockups/05-minigame-subida.jpg` | Resize/WebP, original HUD retained |
| `og-nexora.jpg` | Original code-native identity graphic + hero capture | Rasterized social preview at 1200×630 |
| `favicon.svg` / N mark | Original SVG created for this page | No third-party brand logo |
| Barlow Condensed 600/800 | Fontsource 5.3.0, The Barlow Project Authors | Local Latin WOFF2, OFL included |

Licenses inspected: the game's `THIRD_PARTY_NOTICES.md`, the world-art license/credits, and the public source/license pages. [CGTrader's Royalty Free terms](https://www.cgtrader.com/pages/terms-and-conditions), §21A.2, permit incorporated rendered still images; §21B.1 prohibits machine-learning/training use for No AI assets. [The truck pack listing](https://www.cgtrader.com/free-3d-models/vehicle/truck/low-poly-truck-3d-model-pack) identifies Royalty Free (no AI). Only final game renders are included; no models are redistributed or submitted to generation tools. The original private download receipt has not been inspected; ownership/provenance follows the project owner's supplied assets and the existing documented license audit.

[Nali's gas station](https://sketchfab.com/3d-models/low-poly-gas-station-game-ready-3d-environment-c6089772504441e0bc68134dcc726655) and [dasy444's forest/mountains](https://sketchfab.com/3d-models/landscape-forest-mountains-94809d21d7aa4cfe9b658a111b35a42c) use [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The public page credits authors, sources, license, and modifications (mesh conversion, textures, scale/palette changes). Kenney and 3DAssets.dev assets are documented CC0. Font copyright and full OFL are distributed in `public/startup/fonts/OFL.txt`.

The renders show an early prototype, including its previous working title, not a promised final release. No social statistics or commercial claims are inferred from the screenshots.

Reproduce assets locally with `node scripts/prepare-startup-media.mjs` when the owner's sibling game/mockup folders are available. The normal production build uses the committed optimized images; it never accesses the private game repo.
