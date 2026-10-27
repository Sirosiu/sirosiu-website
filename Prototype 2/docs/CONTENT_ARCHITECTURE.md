# Content Architecture

## Status

The user has confirmed the top-level journey and URL behavior. A first local preview implements the selector and placeholder routes; its wording, portfolio names, story content, images, and final design remain provisional. The initial two route placeholders do not decide the final number or visual directions.

## Site entry and portfolio selector

The root page (`/`) opens with a short typewriter-style greeting, followed by a selector with multiple portfolio choices. The choices are intended to appear as rectangular cards/boxes in a geometric or angular arrangement; the exact shape, layout, labels, and interaction still need design work. Greeting text such as “Hi, welcome to SIROSIU” or “Hi, SIROSIU is here” is an example only, not approved copy. Use the correct SIROSIU brand spelling and verified personal details.

Each selection opens a distinct portfolio experience rather than merely scrolling to a section on the selector page. `site-next/` currently demonstrates two angular cards; Portfolio 01 uses a locally processed matte from the user's supplied photo to form a dense star portrait, then scroll-transforms into an India map, project placeholders, and a contact ending. Portfolio 02 remains intentionally open. The previously drafted Particle Journey, Origin Notebook, and Glass Observatory concepts remain alternatives for other portfolio directions, not a decision to combine all three.

## Route model

Use route paths as stable, shareable page identities. Initial examples:

| Route | Purpose |
|---|---|
| `/` | Typewriter welcome and portfolio selector. |
| `/portfolio-1` | Home for the first portfolio variant. |
| `/portfolio-1/about` | About page within that variant. |
| `/portfolio-1/projects` | Project index for that variant. |
| `/portfolio-1/projects/:projectSlug` | Optional detail page for a specific project. |
| `/portfolio-1/contact` | Contact page within that variant. |
| `/portfolio-2/...`, `/portfolio-3/...` | Same nested route pattern for other variants. |

Use readable lowercase slugs such as `about`, `projects`, and `contact`. The portfolio number and final slugs may change once the variants are defined.

## Navigation behavior — confirmed requirement

- Selecting a portfolio card navigates to that portfolio's own URL.
- Moving to About, Projects, or another page updates the path, for example `/portfolio-1/about`.
- Refreshing or directly opening a nested URL keeps the visitor on that exact portfolio page; it must not send them back to `/` or the portfolio home.
- Browser back/forward, copied links, and internal navigation should behave consistently.
- Visitors need a clear way to return to their portfolio home and to the portfolio selector.
- A deep link should open its target directly. The welcome animation belongs to `/`; it should not block or replay before a direct nested route. This is the route behavior implied by the user's refresh requirement.

## Current candidate content areas

- Identity and positioning
- Selected projects with contribution, evidence, status, and links
- About / background
- Capabilities supported by real examples
- Experience or learning milestones, accurately labeled
- Contact and approved public profiles

Each portfolio variant may present the same verified facts through a different visual direction and interaction style. Do not invent separate biographies or project claims for visual variation.

## Local preview status

The current preview routes are `/`, `/portfolio-1`, `/portfolio-1/about`, `/portfolio-1/projects`, `/portfolio-1/projects/project-1`, `/portfolio-1/contact`, `/portfolio-2`, `/portfolio-2/about`, and `/portfolio-2/projects`. The first selector copy and Portfolio 01's headlines remain drafts. The user's portrait is integrated into the particle field at `site-next/public/assets/images/portrait.png`; project images, names, descriptions, and contact details remain placeholders until the user supplies material. See `site-next/README.md` and `docs/WORK_LOG.md` for implementation and checks.

## Content rules

See `CONTENT_INVENTORY.md`. Keep claims tied to evidence, distinguish planned/in-progress/completed work, and omit unverified details. The spelling, greeting copy, route labels, project names, location, and portfolio variant descriptions must use verified/approved content.
