# SIROSIU — Project State

Last updated: 2026-10-12
Repository: https://github.com/Sirosiu/sirosiu-website
Default branch: `main`

## Mission and success criteria

Build a distinctive, premium, futuristic personal portfolio for SIROSIU at https://sirosiu.com. Prioritize professional credibility, clear communication of identity, skills and authentic projects, responsive design, accessibility, reduced-motion support, performance, and maintainability. Visual effects must support the experience rather than obscure content.

Initial scope is the personal portfolio only. Broader company/brand features are deferred.

## Current stage and gate status

- **Stage 01 — Technical audit:** complete at source/repository level. Live hosting configuration and fresh live-site verification remain open.
- **Technical direction:** React + TypeScript + Vite approved as the broad frontend direction; static hosting preferred, subject to configuration verification.
- **Stage 02 — Creative direction:** **COMPLETE — Structured Surrealism explicitly approved by the user** (Chat 02 final handoff, 2026-10-12). The prior creative specification has been superseded.
- **Stage 03 — UX and information architecture:** **NEXT / AUTHORIZED.** Chat 03 should develop and review information architecture, page hierarchy, section order, navigation, responsive behavior, project discovery, and interaction model against Structured Surrealism. Previous UX v1.0 is a reference, not a binding design.
- **Stage 04 — Detailed technical architecture:** **BLOCKED** until Chat 03's relevant UX decisions are reviewed and approved. Existing Chat 05 architecture research is retained as reference, not automatically binding.
- **Stage 05 — Frontend implementation:** **NOT AUTHORIZED; previous local/preview implementation authorization is revoked/suspended by the creative reset.**
- **QA, production deployment, and migration:** pending and separately gated. Production must remain unchanged.

## Verified baseline and technical audit — Chat 01

- Repository: `Sirosiu/sirosiu-website` (private).
- Default branch: `main`.
- Audited commit: `7a8c202b79b2e0faefad07b6f9276a3870d7c6e0`.
- Inspected root files at that audited commit: `.gitignore`, `index.html`, `style.css`.
- The application at that audited commit was a minimal static HTML/CSS welcome page with a dark background, violet accent, responsive typography, a simple entrance animation, reduced-motion handling, and a Google Fonts import. It did not contain portfolio navigation, project sections, contact actions, or application JavaScript.
- No `package.json`, lockfile, Vite configuration, Wrangler configuration, workflow files, or `PROJECT_STATE.md` were present in the inspected tree at the audited commit.
- According to the user-provided audit handoff, terminal output showed DNS resolution, HTTPS `HTTP/2 200`, Cloudflare response headers, and live HTML matching supplied local HTML. This was reported evidence; it was not a fresh independent live check.
- Actual Cloudflare Pages project/build/output settings, production branch, custom-domain association, redirects, and latest deployment remain unverified.

## Approved broad technical direction

| Decision | Status | Notes |
|---|---|---|
| Frontend | **Approved** — React + TypeScript + Vite | Broad technology direction remains available after the creative reset. |
| Graphics | **CSS-first effects with selective WebGL/3D where justified** | The new creative exploration must inform whether and how much 3D is needed. |
| Hosting | **Preference** — static hosting, preferably Cloudflare Pages | Must verify the real configuration before deployment changes. |
| Production protection | **Required** | Keep the existing live site unchanged until QA passes and a separate explicit migration authorization is given. |

## Approved creative direction — Structured Surrealism (Chat 02, 2026-10-12)

**Status: explicitly approved by the user.** This creative direction replaces the earlier Nexus × Obsidian / Spatial Precision specification. Repository modifications by Chat 02: none. Implementation code, dependencies, deployment settings, and DNS: unchanged. Visual and performance QA: not performed.

### Concept and creative priority

**Structured Surrealism** combines three complementary approaches:
- **Reality Engine:** surreal environments, impossible architecture, unexpected scale, and continuous environmental transformation.
- **Instrumented World:** engineered spatial logic, layered structures, material changes, and meaningful geometric relationships.
- **Editorial Atlas:** cinematic project showcases, readable typography, authentic project evidence, and clear navigation.

The priority is to balance an immersive, distinctive identity with recruiter usability and professional credibility.

### Approved visual principles

- Combine photorealistic environments with stylized geometry.
- Explore architectural forms, surreal spatial relationships, material transformations, dramatic lighting, reflections, and controlled atmospheric depth.
- Use expressive editorial typography while keeping essential content legible.
- Explore palettes appropriate to the chosen environment; no earlier palette is automatically binding.
- Reserve photorealism for important environments, featured projects, and meaningful reveals.
- Avoid generic futuristic decoration, gratuitous effects, and environments that distract from the work.

### Transition philosophy

The tiny-opening-to-enormous-world transition is a **possible signature moment, not a mandatory centerpiece**. Other possibilities include continuous environmental material/form changes, architectural layers unfolding to reveal hidden structure, framed images expanding into cinematic panoramas, and surreal environments resolving into authentic project presentations. Transitions must preserve user control and must not hijack scrolling or block access to content.

### Authentic project storytelling

The imagined environment establishes atmosphere; real work establishes credibility. Use verified project screenshots, photographs, demonstrations, architecture diagrams, technical visualizations, source repositories, and relevant links where available. Describe contributions, implementation, results, and project status honestly. Never present speculative environmental artwork as completed engineering work or fabricate project achievements.

### Accessibility and technical constraints

- Preserve semantic, keyboard-accessible navigation; keep Projects, About, and Contact easy to reach.
- Essential content must work without WebGL.
- Support reduced motion with static compositions and simplified transitions.
- Design deliberate mobile layouts rather than shrinking the desktop experience.
- Prioritize efficient loading, optimized assets, and measured performance.
- Prefer CSS-first effects and use Three.js/WebGL selectively where justified.
- Retain the approved broad technical direction: React + TypeScript + Vite; static hosting preferred, with Cloudflare Pages configuration verification still required.
- Preserve the existing production site until the replacement passes QA and a separate explicit migration authorization is given.

### Decisions intentionally left open

The approved direction does **not** approve a specific hero scene, final palette, exact transition choreography, or detailed 3D implementation. These remain for UX/design exploration and later architecture review. The reference sites previously provided are inspiration, not templates to copy.

### Superseded creative decisions — historical reference only

The following prior Chat 02 choices are superseded and must not constrain the new direction: Nexus × Obsidian / “Spatial Precision”; dark graphite + lavender palette; Space Grotesk / Inter / IBM Plex Mono selection; “The Spatial Signature” S-inspired sculpture, materials, and lighting; and prior hero interactions, static poster composition, and motion details. They may be reconsidered only if independently supported by the new direction; their former approval does not carry forward.

## Prior UX approval — Chat 03, to be reviewed under Structured Surrealism

The user previously approved UX proposal v1.0 for the former creative direction. Preserve it as a useful starting point, not as an unchangeable visual specification. Chat 03 is now authorized to review and revise it against the approved Structured Surrealism direction.

- **Initial information architecture:** single-page homepage.
- **Previous section order:** Navigation → Hero → Featured Projects → About → Technical Capabilities → Learning Journey & Experience → Contact → Footer.
- Persistent desktop navigation and accessible mobile menu.
- Curated, evidence-led project cards with authentic project information and verified links.
- Technical capability groups supported by demonstrable skills and project evidence.
- Verified learning/experience milestones clearly distinguished as completed, ongoing, or planned.
- Direct email and approved professional profile links; résumé optional.
- Detailed project pages only if content justifies them.
- Adaptive desktop, tablet, and mobile layouts without unintended horizontal scrolling.
- Semantic structure, keyboard usability, visible focus, contrast verification, touch usability, reduced-motion support, and content integrity remain requirements.
- **Must be revisited after the new creative direction is approved:** hero role and scale, the “tiny opening into an enormous world” transition, section transitions, spatial navigation, motion/interaction behavior, mobile simplification, and any layout choices coupled to the previous hero concept.
- **Open content inputs:** primary audience and final copy; verified project inventory and artifacts; biography, skills and learning milestones; approved contact details/profile links; optional résumé. Never invent achievements, project details, metrics, proficiency claims, or experience.

## Prior Chat 05 architecture research — retained, not automatically binding

Chat 05's Detailed Technical Architecture proposal v1.0 was approved for the previous creative direction. Preserve it as technical research to reassess after the creative and relevant UX decisions are approved.

Prior recommendations to re-evaluate:
- React + TypeScript + Vite.
- Direct Three.js isolated behind a React component boundary.
- Static hero poster before WebGL initialization.
- Static hero by default on mobile.
- Typed local TypeScript modules for portfolio content; no backend/CMS initially.
- Static hosting, preferably Cloudflare Pages after configuration verification.
- Preview/QA before any production migration.
- Unresolved research items: geometry/asset production, concrete performance budgets, minimum necessary dependencies and component boundaries, content inputs, and Cloudflare configuration.

The new concept may justify keeping, changing, or reducing the prior rendering approach. Do not start implementation or assume the prior hero-specific decisions still apply.

## Risks and verification requirements

- The “Reality Engine” concept is not yet approved; multiple distinct alternatives and visual reference boards are required first.
- Do not copy reference websites. Translate their relevant qualities into original design proposals.
- Avoid visual spectacle that obscures identity, projects, navigation, or contact.
- The tiny-opening/huge-world transition must be evaluated for usability, performance, mobile behavior, keyboard access, and reduced-motion alternatives.
- Photorealistic project reveals must use authentic project material and must not delay essential content.
- Reassess the rendering approach and architecture only after the new creative direction and relevant UX are approved.
- Establish measurable performance budgets and verify them through actual tests; do not claim unmeasured results.
- Verify actual Cloudflare Pages build/output settings, production branch, custom domain, redirects, and latest deployment before any deployment changes.
- Keep the current production site intact.

## Roadmap

1. **Technical audit — complete at source/repository level.** Preserve audit findings and open deployment verification items.
2. **Creative direction — complete.** Structured Surrealism is explicitly approved. No exact hero scene, final palette, transition choreography, or detailed 3D implementation has been approved.
3. **UX and information architecture — next / authorized.** Chat 03 should review and revise the prior UX proposal against Structured Surrealism and present relevant UX decisions for user review/approval.
4. **Detailed technical architecture — blocked.** Reassess retained Chat 05 research only after relevant UX decisions are approved.
5. **Frontend implementation — not authorized.** No application code, dependency changes, implementation commits, or deployment changes are authorized by this handoff.
6. **QA and refinement — pending.** Test links, interactions, responsive layouts, accessibility, reduced motion, performance, console/network errors, and browsers after implementation is separately authorized.
7. **Deployment and handover — pending and separately gated.** Verify hosting configuration and obtain explicit production migration authorization only after QA passes.

## Handoff protocol

Each specialist chat must report scope completed, evidence, exact files changed (if any), verification results, proposed versus approved decisions, risks/open questions, and a concise next handoff. The coordinator reconciles the report here before changing stage status. A working hypothesis is not approval; creative approval is not implementation authorization; implementation is not verification.

## Next action — Chat 03 UX & Information Architecture

Use the approved Structured Surrealism creative brief above to develop the information architecture, page hierarchy, section order, navigation, responsive behavior, project discovery, and interaction model. Revisit the prior UX proposal where it depends on the former visual direction. Do not assume a specific hero scene, final palette, exact transition choreography, or detailed 3D implementation. Keep recruiter clarity, authentic project evidence, accessibility, mobile usability, reduced motion, and performance central. Present material UX choices and trade-offs for user approval before treating them as final.

Do not begin implementation as part of this handoff. Keep Chat 05 detailed architecture blocked until the relevant UX decisions are approved; keep Chat 04 implementation unauthorized; preserve production and deployment safeguards.
