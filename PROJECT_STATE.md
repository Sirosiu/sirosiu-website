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
- **Stage 03 — UX and information architecture:** **COMPLETE — UX Proposal v2.0 explicitly approved by the user** (2026-10-12). The approved baseline is single-page first with dedicated project pages when justified; hybrid conventional labelled navigation plus contextual spatial cues; hybrid continuous environmental changes plus a small number of triggered cinematic reveals; balanced audiences of recruiters, internship evaluators, potential clients, and technical collaborators.
- **Stage 04 — Detailed technical architecture:** **COMPLETE — Architecture Proposal v2.0 explicitly approved by the user** (2026-10-12) as the planning baseline, with all open items, verification requirements, and production safeguards retained. The architecture approval authorizes planning only, not implementation. No application code edits, dependency changes, implementation commits, deployment, or DNS changes.
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

## Approved UX Proposal v2.0 — Chat 03 (2026-10-12)

**Status: explicitly approved by the user as written.** This is the UX baseline for architecture planning. Repository changes by Chat 03: none. No implementation, accessibility, or performance tests were performed as part of the UX stage.

- **Structure:** single-page first, with dedicated project pages when justified by authentic content.
- **Navigation model:** hybrid — conventional labelled navigation supported by contextual spatial cues.
- **Motion model:** hybrid — continuous environmental changes during scrolling, plus a small number of triggered cinematic transformations at meaningful reveals.
- **Primary audience:** balanced personal portfolio for recruiters, internship evaluators, potential clients, and technical collaborators.
- **Approved proposed section order:** Global navigation → Hero / Identity → Selected Projects → About → Technical Capabilities → Journey & Experience → Contact → Footer.
- Persistent desktop navigation and accessible mobile menu.
- Curated, evidence-led project cards with authentic project information and verified links.
- Technical capability groups supported by demonstrable skills and project evidence.
- Verified learning/experience milestones clearly distinguished as completed, ongoing, or planned.
- Direct email and approved professional profile links; résumé optional.
- Detailed project pages only if content justifies them.
- Adaptive desktop, tablet, and mobile layouts without unintended horizontal scrolling.
- Semantic structure, keyboard usability, visible focus, contrast verification, touch usability, reduced-motion support, and content integrity remain requirements.
- **Still intentionally open:** exact hero scene, final palette, exact transition choreography, project-specific page decisions based on authentic content, and detailed 3D implementation. These are not approved by UX v2.0.
- **Open content inputs:** primary audience and final copy; verified project inventory and artifacts; biography, skills and learning milestones; approved contact details/profile links; optional résumé. Never invent achievements, project details, metrics, proficiency claims, or experience.

## Chat 05 architecture research and review — 2026-10-12

Chat 05 re-read the current project record and re-fetched the root `index.html`, `style.css`, and repository contents. The handoff reports no application edits, dependency installation, commits, deployment/DNS changes, or implementation, responsive, accessibility, or performance tests. The user explicitly approved Architecture Proposal v2.0 as the planning baseline, retaining the documented open items, verification requirements, and production safeguards. Confirmed preferences:

- **Rendering:** CSS-first, with selective WebGL only when a specific experience justifies its cost.
- **Performance budgets:** provisional until a representative visual prototype has been measured.
- **Additional feedback:** none.

The recommendations align with the approved Structured Surrealism direction and UX Proposal v2.0. This review handoff asks Chat 00 to record the review decisions, preserve open items, and determine whether architecture questions remain. The user’s explicit final approval has now been received. Stage 04 is complete as an approved planning baseline. The open items below remain open by design and do not imply final visual choices or measured performance results.

### Consolidated architecture baseline proposed for approval

- Retain React + TypeScript + Vite.
- Build environmental effects, layering, and transitions with CSS first; add Three.js/WebGL only for experiences whose benefits justify the added complexity and cost.
- Keep content and navigation independent of optional graphics; essential content must work without WebGL.
- Begin with a small single-page application and typed local content. Defer a CMS, backend, global state manager, router, and dedicated animation library until actual requirements justify them.
- Preserve normal scrolling, keyboard accessibility, reduced-motion alternatives, and deliberate desktop/tablet/mobile layouts.
- Keep environmental artwork distinct from authentic technical project evidence.
- Use provisional, measurable performance budgets; validate and revise them against a representative visual prototype and actual builds/devices. No performance result is claimed yet.
- Prefer static hosting, with Cloudflare Pages configuration verification required before deployment decisions.
- Preserve production and keep implementation, QA, and migration separately gated.

### Open items to preserve

- Exact hero environment and final palette.
- Signature transition design and choreography.
- Which individual experiences, if any, justify real-time 3D.
- Scene and asset authoring methods.
- Final numeric performance budgets and test results, pending representative prototype measurements.
- Authentic project inventory, evidence, and final copy.
- Cloudflare Pages build/output settings, production branch, custom domain, redirects, latest deployment, and rollback process.

These are not implied approvals. They do not all need to be resolved before the architecture baseline can be approved, provided the architecture documents them as constraints/open decisions and does not prematurely commit to them.

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

- Structured Surrealism and UX Proposal v2.0 are approved, but the exact hero scene, final palette, transition choreography, and detailed 3D implementation remain open.
- Do not copy reference websites. Translate their relevant qualities into original design decisions.
- Avoid visual spectacle that obscures identity, projects, navigation, or contact.
- Any cinematic transition must be evaluated for usability, performance, mobile behavior, keyboard access, and reduced-motion alternatives.
- Photorealistic project reveals must use authentic project material and must not delay essential content.
- Stage 04 must reassess the rendering approach and retained Chat 05 research against the approved UX; do not assume Three.js/WebGL is necessary merely because it was proposed earlier.
- Establish measurable performance budgets and verify them through actual tests; do not claim unmeasured results.
- Verify actual Cloudflare Pages build/output settings, production branch, custom domain, redirects, and latest deployment before any deployment changes.
- Keep the current production site intact.

## Roadmap

1. **Technical audit — complete at source/repository level.** Preserve audit findings and open deployment verification items.
2. **Creative direction — complete.** Structured Surrealism is explicitly approved; exact hero scene, final palette, transition choreography, and detailed 3D implementation remain open.
3. **UX and information architecture — complete.** UX Proposal v2.0 is explicitly approved by the user as written.
4. **Detailed technical architecture — complete.** Architecture Proposal v2.0 is explicitly approved as the planning baseline. Its open visual, asset, performance measurement, content, and hosting verification items remain documented.
5. **Frontend implementation — not authorized.** No application code, dependency changes, implementation commits, or deployment changes are authorized by this handoff.
6. **QA and refinement — pending.** Test links, interactions, responsive layouts, accessibility, reduced motion, performance, console/network errors, and browsers only after implementation is separately authorized and exists.
7. **Deployment and handover — pending and separately gated.** Verify hosting configuration and obtain explicit production migration authorization only after QA passes.

## Handoff protocol

Each specialist chat must report scope completed, evidence, exact files changed (if any), verification results, proposed versus approved decisions, risks/open questions, and a concise next handoff. The coordinator reconciles the report here before changing stage status. A working hypothesis is not approval; creative approval is not implementation authorization; implementation is not verification.

## Next action — Chat 00 implementation authorization gate

Stage 04 is complete: the user explicitly approved Chat 05 Architecture Proposal v2.0 as the planning baseline, including its documented open items and safeguards. The next possible stage is Stage 05 — Frontend Implementation, but it remains **NOT AUTHORIZED**. Chat 00 must obtain separate explicit user authorization before implementation begins.

Before any implementation authorization, preserve these constraints: no invented project facts; no premature commitment to the exact hero scene, palette, transition choreography, or WebGL experiences; use CSS-first rendering and justify each selective WebGL use; keep content/navigation independent of graphics; defer unnecessary dependencies and services; retain provisional performance budgets until a representative prototype is measured; and keep Cloudflare Pages verification, QA, and production migration as separate gates.

Until the user explicitly authorizes Stage 05, do not modify application code, install or change dependencies, create implementation commits, or change DNS/deployment settings. The existing production site must remain unchanged. No implementation, accessibility, responsive, or performance tests have been performed.
