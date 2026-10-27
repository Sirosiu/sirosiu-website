# Creative Direction

## Status

Open. This is a fresh exploration; no palette, typeface, hero object, scene, transition, or previous Prototype 1 aesthetic is approved by this document.

## Brief

Develop a recognizable visual language that feels personal and memorable while making real work easy to understand. Immersive elements should have a clear purpose and never obstruct navigation, content, or user control.

## Confirmed entry and portfolio structure

The user wants `/` to begin with a typewritten greeting and then reveal a selector with multiple portfolio choices. They described rectangular boxes in an angular/geometric arrangement. Interpret “angular” as a visual layout idea, not a request to use the Angular framework. The exact arrangement, card shape, greeting text, labels, and motion remain open.

Each selector choice should open its own portfolio experience, with nested pages such as `/portfolio-1/about`. These must be real URL routes: refresh, direct links, and browser back/forward should preserve the exact page. The typewriter greeting belongs to the root selector; a direct visit to `/portfolio-1/about` should go straight to About. See `CONTENT_ARCHITECTURE.md` for the route map and `TECHNICAL_ARCHITECTURE.md` for implementation implications.

The three concepts below can be treated as candidate portfolio variants instead of competing for a single final design. A possible mapping is Portfolio 1 = Particle Journey, Portfolio 2 = Origin Notebook, and Portfolio 3 = Glass Observatory. This mapping remains provisional until the user confirms how many variants they want and approves the assignment.

## Preference synthesis — provisional input, not a selected concept

The user has asked us to use only the reference ideas needed for SIROSIU, and to prefer suitable existing online/GitHub code instead of rebuilding everything. The full evidence and which preferences are confirmed versus provisional remain in `REFERENCE_LIBRARY.md`.

| Candidate need | Saved user input | Likely implementation path | Status |
|---|---|---|---|
| A personal opening and memorable ending | Confirmed: portrait made from particles/stars, gentle cursor influence, a concise location treatment, and a matching dissolve back to particles. A loading counter is liked. | One original visual narrative; inspect R3F/Three.js examples and shader techniques if the approved concept uses 3D. Keep the important name/location in HTML, using only verified SIROSIU facts rather than copying reference copy. | Strongest confirmed interaction preference; visual design and scope still open. |
| A site that feels like one connected journey | Broad preference: whole Sébastien Lempens experience; confirmed page-wide environmental cursor response from Igloo. Scroll-led 3D camera/story appears across several liked references. | Use semantic page sections with one scroll source; if the page needs a 3D camera, evaluate R3F + Drei `ScrollControls` or a single timeline library. Keep native scrolling unless testing gives a clear reason to smooth it. | Candidate structure, not approved layout or stack. |
| Tactile surfaces and navigation | Provisional likes include paper across the page, notebook/hand-drawn path, frame changes, a glass bottom navigation bar, and a bottom progress rail. | Treat paper and glass as separate visual directions to compare. The progress rail can be a small accessible HTML/CSS component; avoid adding a dependency just for it. | Several details await confirmation; do not stack all surfaces by default. |
| Pointer response and secondary motion | Likes include cursor-reactive environments, an eggplant with springy motion, a portrait shadow/letter response, and a glass project hover state. | CSS pointer variables for 2D surfaces; Three.js raycasting for 3D; Wiggle only if an approved model has a compatible rig. Keep touch and keyboard equivalents. | Mixed confirmation status; per-control details remain open. |
| Optional standout object | Provisional likes include Oryzo's flipping coaster/hyper-realistic hand and Aurelia's smooth jellyfish motion. | Requires a clear storytelling role, a separately licensed 3D model or original asset, mobile/performance review, and fallback. These are optional branches, not required features. | High complexity; do not select until the concept needs one. |

### Early fit notes

- These inputs do not yet form one visual system: paper/editorial, glass/chrome, and particle/3D directions can compete. Explore distinct concepts rather than layering every reference into one page.
- For a source-first implementation, current candidates include official React Three Fiber/Drei tools for a 3D scroll story, GSAP or Motion for DOM/SVG timeline work, Lenis only if native scrolling needs a tested enhancement, and CSS for simple paper/glass UI. `docs/ASSET_REGISTER.md` records exact sources, license notes, and limitations.
- No library, asset, visual direction, page structure, or implementation has been selected. This synthesis is a planning aid for the next concept options.

## Concept options — provisional, awaiting the user's choice

These concepts combine only a small subset of the saved references. They are original directions, not recreations.

### A. Particle Journey — recommended starting direction

- **Experience:** Open on a human portrait forming from light-like particles. A restrained cursor field gives it subtle presence. Scrolling carries that particle field into verified personal details and project stories, then the final moment dissolves back into the same particles. The progress control stays easy to find; project names, roles, and descriptions remain HTML.
- **Why the parts fit:** The transformation itself tells the visitor who SIROSIU is and then connects that identity to real work. It uses the user's strongest confirmed preference: the particle portrait's entry and matching exit, alongside a whole-site immersive story.
- **Source approach:** React Three Fiber with Drei `ScrollControls` is the candidate route if a 3D canvas is approved. Use one timeline tool (GSAP or Motion) only if DOM/particle transitions need it. Do not add Lenis by default; preserve native scroll and build a small progress rail in HTML/CSS. See source and license notes in `ASSET_REGISTER.md`.
- **Trade-offs:** Most personal and cinematic; highest GPU/performance and asset cost. Needs an approved portrait source and a useful non-WebGL/mobile fallback. Avoid continuous effects when the scene is idle.

### B. Origin Notebook — tactile editorial direction

- **Experience:** Treat the site as a clean, open notebook. A thin drawn line guides the visitor through the introduction, verified background, and project stories. Paper texture and photo-like project frames provide the visual system; the line changes direction and scale for phone layouts.
- **Why the parts fit:** The notebook and traveling line are already saved as a specific user preference. This gives the portfolio an editorial story without requiring a full-screen 3D world.
- **Source approach:** Semantic HTML, CSS, and an SVG path cover most needs. GSAP/ScrollTrigger is optional for the line and page transitions; a small SVG progress indicator can be written locally. No external 3D asset is required.
- **Trade-offs:** Lowest runtime cost and clearest reading path; strong match for project detail. It is less cinematic than the particle/3D references and depends on authentic project images and copy. The paper texture must stay subtle enough for text contrast and phones.

### C. Glass Observatory — restrained interactive 3D direction

- **Experience:** Keep the page content clean and scanable, with a fixed translucent navigation/progress bar. A single responsive 3D object or project-image arrangement shifts with scroll and gently responds to pointer movement; selecting a project opens a regular, readable case study.
- **Why the parts fit:** It combines the saved glass navigation, project-stack movement, and page-wide cursor response into one controlled device, without making every section a new 3D scene.
- **Source approach:** CSS for glass UI and pointer states; React Three Fiber/Drei only for the central scene. Use `ScrollControls` or a DOM-driven timeline, not both as competing scroll owners. Models require a separate source/license decision.
- **Trade-offs:** Balances a distinctive hero with a usable portfolio; less demanding than a continuous world. Model provenance and phone rendering remain costs. Keep every project reachable without interacting with the 3D object.

### Recommendation

Use the hub to let visitors compare distinct portfolio prototypes. If the user wants three initial options, the proposed A/B/C mapping gives them clearly different experiences without forcing particle, paper, and glass into one design. The landing selector itself should preview each option with enough information to make the choice clear. Keep the card geometry and exact variant mapping provisional until the user reviews them. No repository, visual design system, or implementation is approved yet.

## Exploration process

1. Review user-provided references and record what each teaches in `REFERENCE_LIBRARY.md`.
2. Explore two or three materially different concepts, including their strengths, trade-offs, mobile treatment, and accessibility implications.
3. Present options to Project HQ/user. Record only the selected direction here and in `DECISIONS.md` after approval.
4. Translate the chosen direction into a compact design system before detailed implementation.

## Open questions

Visual concept, color, typography, composition, imagery, hero behavior, motion, 3D role, and how the work is presented.
