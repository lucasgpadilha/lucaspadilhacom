# Visual direction

Reference file:

```text
public/reference/hero-target.png
```

This image is a direction-of-art reference, not a production background. The final site keeps real HTML copy, navbar, controls, labels and responsive layout.

## Target

The hero should feel like a cinematic DevOps portfolio:

- full-screen cloudscape video background
- strong copy on the left
- command deck / deployment blueprint as the signature visual on the right
- dark premium glass UI
- technical and memorable without becoming a SaaS dashboard

## Deployment scene strategy

The primary visual of the right panel is the raster factory asset (`public/assets/factory/deployment-factory.webp`), matching the reference image. The earlier "code-native SVG command deck" attempt was reverted: it read as flat pills on a dark blueprint and missed the target completely.

The active strategy is raster centerpiece plus HTML overlay, as in the reference:

- header row: "Run pipeline" button (left) and live status pill (right) — no title text inside the panel
- one row of 8 glass stage cards (icon + label) above the machines: Commit, Build, Tests, Terraform Plan, AWS Provision, Ansible Config, Deploy, Monitoring — brand SVGs for Terraform/AWS/Ansible, Lucide for the rest
- the factory image below the cards, with a GSAP-driven light sweep (`--sweep-x`) following the active stage and a small HTML "LIVE" badge
- footer row: animated handoff log (left) and a "Latest commit" box with mono hash, message and relative time (right)
- React state for active stage, status and log; Framer Motion only for entrance/reveal

See `docs/motion-strategy.md` for the option analysis; the implemented route is option 1 (raster asset plus HTML overlay), chosen because the asset matches the reference art and all text stays in HTML.

## Rules

- Do not use the reference image as a full-page background.
- Do not put fake text inside raster assets — all labels, logs and badges are HTML.
- Do not replace the factory centerpiece with flat SVG pills or a dashboard grid.
- Keep the video visible and cinematic — overlays darken for legibility, not to bury the scene.
- Keep motion subtle and operational.
