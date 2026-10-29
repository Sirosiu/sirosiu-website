# SIROSIU Website — Project State

Last updated: 2026-10-29
Repository: https://github.com/Sirosiu/sirosiu-website
Workspace: `Prototype 2/`
Branch at start of scaffold work: `fix/restore-original-hero-main`

## Mission

Build a distinctive, polished SIROSIU website with a strong visual identity, purposeful immersive interaction, credible real-work storytelling, and sound engineering. Begin from a new creative direction; do not use Prototype 1 as the design brief.

## Current phase

**Phase 2 — Local prototype in progress.** The current hero at `/portfolio-1` has a typewriter headline, SIROSIU/India copy, the preserved Raging Sea visual, and an adaptive Canvas 2D trail cursor with an always-visible guiding dot. The native system cursor is suppressed across all interactive and page elements. When still, the ribbon gracefully rests while the guiding dot maintains a gentle guiding pulse; on hover, the ring expands over interactive targets; and across dark (`#121211`) and light (`#e5dfd4`) sections, both the guiding dot and ribbon trails automatically invert and adapt via `mix-blend-mode: difference` for optimal contrast. Preview: `http://127.0.0.1:5173/portfolio-1`. Implementation details: `site-next/src/CanvasCursor.tsx` and `site-next/src/styles.css`. The app build passes; Vite reports a JavaScript bundle advisory. The one-off avatar study made on 2026-10-29 was removed at the user's direction.

The research context is retained below for future selection and reuse. No copy or media from the portfolio inspiration-site references was imported. The PMNDRS particle example remains research/reference only; its temporary implementation was removed. The active cursor is an independent Canvas 2D implementation inspired by Cursify's documented behavior; no Cursify source was copied because its repository has no license. Seventeen references are logged in `docs/REFERENCE_LIBRARY.md`. The desktop and phone/tablet reference passes are complete for the original twelve-site list, and the newer five-site inspiration batch is also complete. The associated GitHub and license evidence, including limits and unverified claims, remains in the reference library and asset register. Existing app copies remain preserved.

## Confirmed constraints

- Work inside `Prototype 2/`; the future app belongs in `site-next/`.
- Start the creative direction fresh. References are for learning, not copying.
- Use authentic, verified project information and only reuse assets after provenance/license review.
- Keep the existing production site, hosting, DNS, and deployment path unchanged.
- GitHub is the shared project record; separate chats do not automatically share their conversation history.
- Prefer suitable existing open-source libraries and components for approved needs; implement only original SIROSIU parts that are missing. Check source, license, compatibility, and integration cost before selecting anything.
- Keep a portable project record so another AI agent can resume from repository documents without depending on chat history.
- Start the website with a typewritten greeting and portfolio selector. Each selected portfolio has distinct URL routes and nested pages; direct visits and refreshes must preserve the exact route.

## Open decisions

Portfolio count and labels, card geometry, variant-to-concept mapping, final content, visual system, exact stack/router/hosting configuration, 3D use, performance budgets, asset choices, and release configuration. The hub and refresh-safe nested-route requirement are confirmed; see `docs/DECISIONS.md`.

## Next action

Show the updated portrait particle preview and gather feedback. Ask for real project names/details and contact links before replacing the labeled placeholders. Continue only in `site-next/`. Document each meaningful change in `docs/WORK_LOG.md` and update `docs/handoffs/CURRENT_HANDOFF.md`.
