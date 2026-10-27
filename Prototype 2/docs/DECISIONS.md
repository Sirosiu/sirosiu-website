# Decisions

Record durable decisions only after the user approves them. Recommendations stay provisional until then.

## Confirmed for this reset

| Decision | Basis |
|---|---|
| Build a fresh direction; Prototype 1 is not the design specification. | User instruction and current project plan. |
| Keep this work inside `Prototype 2/`; put the future replacement app in `site-next/`. | User instruction and workspace plan. |
| Preserve the existing app copies while the new project is planned. | Current scope; no cleanup authorized. |
| Keep production, hosting, DNS, and deployment unchanged. | Project safety boundary. |
| Use GitHub project documents as shared memory; chats do not sync their private histories automatically. | Project workflow. |
| Prefer suitable existing open-source libraries/components for approved needs; implement only the original SIROSIU parts that are missing. Do not recreate every feature seen in references. | User direction on 2026-10-26. Each candidate still needs source, license, fit, and integration-cost review before selection. |
| Keep a chronological work log and portable handoff instructions so another AI agent can continue from repository records alone. | User direction on 2026-10-26. |
| Start at a typewritten welcome/portfolio selector; each portfolio option opens a distinct URL, with nested paths such as `/portfolio-1/about` that remain on refresh and direct visit. | User direction on 2026-10-26. Exact greeting, card geometry, route slugs/count, and which concepts fill each route remain open. |
| Build the first runnable preview in `site-next/`, starting with the typewriter welcome, portfolio choices, and a scroll-led sequence. | User direction on 2026-10-26. This supersedes the earlier “code comes later” scope. Keep final names/copy/images as placeholders until supplied; do not connect to Drupal or deploy. |
| Adapt the particle-portfolio experience for Portfolio 01: personal star portrait, cursor response across the page, India-centered location chapter, projects, and contact. | User direction on 2026-10-26. Use SIROSIU identity and original layout; do not copy Daniel Ingrassia's photo, media, source, exact wording, or site design. The user supplied their portrait on 2026-10-26; authentic project and contact facts are still to come. |
| Use a lightweight Canvas 2D point scene for the first local particle prototype. | Implementation choice for this prototype: the reference has no verified public source repo, the effect works without an additional runtime dependency, and semantic page content stays in HTML. Revisit only if a later direction requires true 3D. |
| Make the portrait particle field visibly dense and smooth, using points sampled from a transparent matte derived locally from the user's photo. | User feedback on 2026-10-26: the first render had too few stars and insufficient smoothness. The previous 1,800 desktop points were increased substantially; keep the visual treatment original and the source photo local. |

## Provisional recommendations

- React + TypeScript + Vite as a candidate stack.
- CSS/native effects first, optional 3D only when justified.
- Static frontend initially; no backend unless a real need emerges.
- A focused portfolio structure based on verified content.

## Open decisions

Portfolio count/labels and variant mapping, selector-card design, final content, visual system, exact stack/router/hosting configuration, 3D use, asset choices, QA budgets, deployment settings.

## Superseded historical choices

Any earlier approved Prototype 1 style, specific visual concept, hero scene, palette, typography, transitions, or app-root assumption does not constrain this reset. See the archived notes in `docs/archive/`.

## Change log

| Date | Decision |
|---|---|
| 2026-10-24 | Reset creative direction and establish the isolated `Prototype 2/site-next/` workspace. |
| 2026-10-26 | Adopt source-first, selective reuse and portable work-log/handoff practices. |
| 2026-10-26 | Confirm a portfolio-selection hub with distinct addressable portfolio routes and refresh-safe nested pages. |
| 2026-10-26 | Adapt Portfolio 01 around an original particle portrait, global pointer response, India chapter, projects, and contact; keep its content placeholders user-supplied. |
| 2026-10-26 | Use the newly supplied portrait for the local particle field, increase star density, and smooth the interpolation after the user reviewed the preview. |
