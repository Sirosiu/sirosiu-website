# QA and Release Gates

## Current status

No new application exists in `site-next/`; no tests, accessibility checks, visual review, or performance measurements have been run for it.

## Prototype review checklist

- Approved content is accurate and links work.
- Desktop, tablet, and phone layouts are intentional and usable.
- Navigation and controls work by keyboard; focus is visible; semantics and contrast are checked.
- Reduced-motion preference has a meaningful alternative.
- Essential content remains available with WebGL unavailable or disabled.
- Loading/error states, console output, and asset sizes are reviewed.
- Set and measure performance budgets against the actual build/device; do not claim unmeasured results.

## Release gate

Only after the user approves the prototype: inspect the real hosting/build configuration, create and review a preview, verify redirects/metadata and rollback steps, then request separate explicit authorization before production deployment or migration.
