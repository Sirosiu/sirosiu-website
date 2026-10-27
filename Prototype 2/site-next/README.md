# SIROSIU `site-next` local prototype

This isolated preview begins the new portfolio hub. It includes a typewriter welcome, two portfolio routes, nested About/Projects/Contact paths, and an original particle-scene study in Portfolio 01. Portfolio 01 uses a star-particle portrait made from the user's supplied photo; scrolling moves the scene through an India map, project cards, and a star dispersal at Contact. A custom pointer glow follows the cursor across the page. The projects, copy, and contact details remain placeholders until supplied by the user.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. A production build can be generated with `npm run build` and viewed with `npm run preview`.

## Preview routes

- `/` — typewriter welcome and portfolio selector
- `/portfolio-1` — particle portrait, India, projects, and contact experience
- `/portfolio-1/about`, `/portfolio-1/projects`, and `/portfolio-1/contact` — nested page placeholders
- `/portfolio-1/projects/project-1` — project detail route example
- `/portfolio-2` — second portfolio placeholder
- `/portfolio-2/about` and `/portfolio-2/projects` — nested page placeholders

Vite's local SPA fallback supports direct refreshes during preview. Before publishing, configure the selected static host to serve valid nested routes or prerender them, then verify direct links and refreshes on that host. This app does not connect to Drupal or change the existing site.

## Personal portrait slot

`public/assets/images/portrait.png` is a locally processed, transparent cutout derived from the user's supplied photo. The Canvas samples its subject mask and builds a dense particle portrait; the photo itself is not displayed as a rectangular image. Replace this file to change the portrait. The source photo remains outside the repository. The screenshot of Daniel Ingrassia's site is not used as an image asset.
