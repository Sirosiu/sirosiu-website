# Technical Architecture

## Status

`site-next/` is an authorized local prototype. React + TypeScript + Vite are implemented there; this does not alter the existing root app or configure deployment. The preview uses a small internal history-based navigation helper rather than an added router dependency. It needs a host-specific SPA fallback or prerendering before any public deployment.

## Starting point to evaluate

- React + TypeScript + Vite are in use in the isolated preview. Revisit only if later requirements justify a change.
- Portfolio 01 currently uses a custom Canvas 2D point field for its local particle study; it adds no runtime dependency and is not a reconstruction of the reference site's unknown renderer.
- Consider Three.js / React Three Fiber / Drei only if an approved later concept needs real-time 3D. No official source repository for Daniel Ingrassia's site was identified; no site code or media was reused.
- Keep content, page sections, shared UI, and optional scenes modular. Keep important content independent of WebGL.
- Start as a static frontend unless a concrete requirement justifies a backend.
- Add only dependencies with a documented purpose.

## Future app boundary

The replacement is intended to live under `site-next/`, independent of the existing root and nested app copies. Those copies remain untouched while research proceeds. Do not change root build/deployment behavior.

## User-confirmed routing requirement (2026-10-26)

The site needs a portfolio selector at `/`, then distinct portfolio variants under their own paths, with nested pages such as `/portfolio-1/about` and `/portfolio-1/projects`. A refresh, direct link, or browser-history navigation must preserve the exact route. The `/` greeting/selector must not intercept direct visits to a nested portfolio page.

Implementation: the local preview uses history API navigation and Vite's SPA development fallback. Manual review confirmed direct navigation and refresh at `/portfolio-1/about`. Vite development fallback alone does not prove production deep links work. Configure the chosen static host to serve the app entry for valid nested paths, or prerender them; verify direct URL, refresh, back/forward, and unknown-route behavior before release.

The greeting is a visual typewriter effect, not a routing prerequisite. The preview includes a full-text accessible equivalent, reduced-motion handling, and a skip control. The selector appears after the typewriter completes. Final copy, route slugs, number of portfolio variants, host, and whether to adopt a full routing library remain open.

Portfolio 01 samples the transparent matte at `public/assets/images/portrait.png`, locally derived from the user's supplied photo. The source photo stays outside the project; the Canvas uses the matte to position stars and never renders the portrait as a rectangular image. Desktop uses 72,000 points and phone 36,000. Precomputed screen coordinates, typed working buffers, and batched Canvas paths reduce per-frame allocation; easing and a 60 fps animation loop keep motion continuous. Tone buckets preserve more of the photo's highlight detail. Its semantic headings, map statement, project links, and contact placeholders remain HTML. The Canvas scene is decorative and hidden from assistive technology. The pointer effect is limited to fine-pointer devices; touch devices retain native scrolling, and reduced-motion preference removes continuous particle/cursor motion while preserving the content and scroll chapters.

## Decisions to make later

Framework/configuration, component boundaries, rendering strategy, content model, animation approach, asset pipeline, testing approach, measurable performance budgets, and hosting build settings. Verify hosting configuration before any release proposal.
