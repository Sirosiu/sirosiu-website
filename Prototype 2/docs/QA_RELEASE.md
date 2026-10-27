# QA and Release Gates

## Current status

`site-next/` now contains the local hub and the first particle portfolio. After feedback about density and smoothness, Portfolio 01 uses the user's transparent portrait matte, 72,000 desktop / 36,000 phone points, tone-based brightness, precomputed coordinates, typed buffers, batched drawing, and eased motion. Compared the local portrait in Brave with the user's supplied reference screenshot and the live Daniel Ingrassia page; the updated field has a denser, brighter bust with more source-photo contrast. The local preview is open at `http://127.0.0.1:5173/portfolio-1`. `npm --prefix site-next run build` and `git diff --check` passed on 2026-10-26. Earlier browser review confirmed nested project routes survive refresh. Comprehensive responsive, keyboard, accessibility, and device-performance review remains open. No automated tests were added or run.

## Prototype review checklist

- Approved content is accurate and links work.
- Desktop, tablet, and phone layouts are intentional and usable.
- Navigation and controls work by keyboard; focus is visible; semantics and contrast are checked.
- Portfolio choice, nested pages, direct links, browser back/forward, and refreshing a route such as `/portfolio-1/about` preserve the requested page; they never redirect to `/` unexpectedly.
- The typewriter greeting has an accessible full-text equivalent, respects reduced motion, and does not delay or intercept direct nested routes.
- Reduced-motion preference has a meaningful alternative.
- Essential content remains available with WebGL unavailable or disabled.
- Loading/error states, console output, and asset sizes are reviewed.
- Set and measure performance budgets against the actual build/device; do not claim unmeasured results.

## Release gate

Only after the user approves the prototype: inspect the real hosting/build configuration, create and review a preview, verify redirects/metadata and rollback steps, then request separate explicit authorization before production deployment or migration.
