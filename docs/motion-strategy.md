# Motion strategy

## Context

The current hero direction is right: cinematic video, strong DevOps copy, and a technical visual on the right. The problem is the deployment factory implementation. The raster factory asset creates an uncanny middle ground: too complex to feel native to HTML, but not rich enough to feel like a finished 3D/motion piece. More CSS polish would keep improving the edges without solving the core issue.

The motion decision should therefore come before more component work.

## 1. Raster or video asset plus HTML overlay

Visual quality expected: high if the asset is produced by a designer, 3D tool, Rive, Spline, Lottie, or rendered video. Medium if the asset is generated once and then patched with overlays.

Difficulty: medium. The layout is straightforward, but the asset has to be good. Bad source art cannot be fixed by labels and glow.

Performance: good for WebP/AVIF, acceptable for short WebM/MP4 if compressed and lazy enough for the use case.

Maintenance: good. Copy, labels, states and logs remain in React; the visual asset can be replaced without rewriting the UI.

Risk of AI slop: medium to high if the visual asset is generated and accepted without art direction. Low if the source is a polished video/render.

Astro/React compatibility: excellent.

Assessment: best long-term route if a real loop/render exists, especially `deployment-factory-loop.webm`. The current static factory asset is not strong enough to keep as the primary visual.

## 2. SVG/HTML pure with GSAP

Visual quality expected: high for a premium blueprint, command deck, or technical map. Low for fake 3D factory attempts.

Difficulty: medium. It requires stronger composition and fewer decorative elements, but it avoids pretending CSS is a 3D renderer.

Performance: excellent. SVG, CSS and GSAP are light enough for the hero when scoped carefully.

Maintenance: excellent. Stages, labels, logs and motion states are all code-native.

Risk of AI slop: low if the design stays editorial and technical. High only if it becomes a generic grid or dashboard.

Astro/React compatibility: excellent.

Assessment: best immediate route for this codebase. It removes the weak raster asset and replaces it with an intentional technical visualization.

## 3. Rive or Lottie integrated

Visual quality expected: high if the animation is authored in the right tool. Rive is better for stateful interaction; Lottie is better for preauthored motion.

Difficulty: medium to high because the animation has to be produced outside the codebase.

Performance: good when the file is optimized.

Maintenance: medium. Text and logs should stay in HTML, but animation changes require the source animation tool.

Risk of AI slop: low with a designed animation, medium with a generic marketplace animation.

Astro/React compatibility: good.

Assessment: strong future option, not the fastest path unless a finished `.riv` or Lottie JSON already exists.

## 4. Spline or 3D integrated

Visual quality expected: highest if the scene is modeled and lit well.

Difficulty: high. The 3D scene must be made in Spline; Codex should only integrate it.

Performance: variable. It can be acceptable, but it adds runtime weight and needs mobile QA.

Maintenance: medium. Layout remains in React, but scene edits move to Spline.

Risk of AI slop: low with a real authored scene, very high if attempted in CSS or raw Three.js without a design pass.

Astro/React compatibility: good through a React wrapper, but it is heavier than SVG.

Assessment: best aspirational route for a true 3D factory, but not the right next implementation step without a finished scene.

## Recommendation

Use **SVG/HTML with GSAP** now and move the visual from "factory asset" to **Cloud Island Command Deck**: an editorial blueprint of the deployment flow, with one continuous energy line from commit to monitoring.

Keep the existing WebP factory asset in `public/assets/factory/` as an optional reference or future fallback, but do not use it as the primary hero visual. If a polished `deployment-factory-loop.webm`, Rive, Lottie or Spline scene is produced later, the `DeploymentScene` component can swap its visual base while keeping the same labels, logs and state model.

## Implementation choice

Primary strategy for this pass:

- `DeploymentScene.tsx`
- code-native SVG/HTML visual base
- GSAP timeline for continuous pulse and path progress
- React state for active stage, status and logs
- Framer Motion only for entrance/reveal

This favors intentional design, performance and maintainability over forcing a weak 3D-looking asset into the layout.

## Addendum (2026-06-12)

The SVG/HTML command deck was implemented and rejected: in practice it rendered as flat pills scattered on a dark blueprint and did not get close to the reference art. The decision was reversed to **option 1 (raster asset plus HTML overlay)**: `deployment-factory.webp` is the centerpiece, with HTML stage cards, status, logs and commit box on top, and a GSAP light sweep synced to the active stage. Labels, logs and badges remain HTML, so the asset can still be swapped for a loop/render later without rewriting the UI.
