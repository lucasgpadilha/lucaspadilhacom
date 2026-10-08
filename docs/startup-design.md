# Nexora Games — design direction

## Exploration before implementation

| | A: Roadside cinema | B: Route atlas |
|---|---|---|
| Typography | Barlow Condensed at poster scale, plain sans-serif body | Archivo Narrow, smaller text and map-like composition |
| Composition | Asymmetric opening; actual portrait gameplay beside studio typography; light intermissions | Pale page, diagram-led hero, offset media contact sheet |
| Imagery | Full-color Godot captures, meaningful crops, original HUD intact in gallery | Smaller framed captures, landscape studies, annotated journey |
| Signature | Wide Nexora wordmark and a tall, double-line N mark | Abstract route-line motif |
| Mobile | Vertical gameplay becomes the natural focal point | Atlas loses its spatial relationship at narrow widths |

Select A. The portrait format is a product constraint (livestream gameplay), rather than decoration. A large game image gives stronger evidence than a map-derived graphic. The studio mark is independent of trucks, so the identity can accommodate other games.

```text
studio / game / about / contact / EN PT
┌───────────────────────────────────────────┐
│ Nexora Games                              │
│      headline             gameplay        │
│      studio introduction  tall capture    │
│      explore / contact                    │
└───────────────────────────────────────────┘
light game introduction / chat participation
full-color game captures / scenery
studio vision / built vs exploring vs planned
dark contact / founder / credits
```

## Tokens and principles

- Forest `#163d37`, deep forest `#102b28`, daylight `#edf2ef`, pale fern `#b9d3b9`, road yellow `#f4cf53`, ink `#192a26`.
- Barlow Condensed 600/800, locally hosted with OFL; system sans-serif for body text. The family relates to the game's broadcast typography rather than the portfolio's Space Grotesk.
- 8 px spacing rhythm, large asymmetric image/copy relationships, 72-character body limit. Max content width 1440 px, 24–72 px gutters.
- Full-color actual captures; never invented gameplay. Keep samples visibly marked as prototype imagery; synthetic driver labels are not adoption claims.
- One short opening opacity/transform sequence; respect reduced motion. No scrolling parallax, autoplay video, repeated reveal animations, cards floating on hover or decorative dashboard.
- Native anchors, meaningful section headings, a skip link, 44 px touch targets and visible focus. Language changes retain the portfolio's storage key and URL convention.

## Review against Anthropic frontend-design

The initial plan included numbered section labels, small uppercase tags and a dark-only palette. Remove those conventions: sections are not steps, the identity is carried by the wordmark/image, and light sections make room for readable product context. Keep yellow confined to functional emphasis and actual roadway colors. Use one original N motif rather than a pile of road signs. Avoid pseudo-live indicators: the game is a prototype, not a currently running public session.

## Truth and media boundary

Confirmed from the private game's README and validation/live notes: Godot prototype, TikTok LIVE chat adapter, audience votes/events, persistent progression/customization and an observed real livestream. Do not publish internal metrics, account IDs, source code, reports or private links. Claude API event generation/interpretation and creator tools are planned.

The owner supplied five rendered game captures in `mockups/`; equivalent scenery and HUD are documented in game validation. The page keeps their distinction from a public release and does not treat QA names as real player identities. Licensing is recorded in `startup-media.md` and visible asset credits.

The handoff's email note is outdated: sending and receiving `ceo@lucaspadilha.com` were confirmed in the current session.

## Skills

- [Anthropic frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md): read in full before implementation; drove the two-direction comparison, natural portrait media, restrained motif and removal of template chrome.
- [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): skill and linked rules read in full; apply the fresh rules again to the final changed files.
- React best practices is conditional and unnecessary: this route has no hydrated React components.
- Playwright screenshots are used for real iterative visual inspection and responsive regression checks.
