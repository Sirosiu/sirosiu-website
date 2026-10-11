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
- **Stage 02 — Creative direction:** **RESET / IN PROGRESS.** Prior creative specification is superseded and no longer binding. The new “Reality Engine” direction is a working hypothesis only, not approved.
- **Stage 03 — UX and information architecture:** previous UX proposal v1.0 was approved for the former creative direction. Core portfolio content/navigation decisions remain useful reference, but visual-dependent UX decisions must be reviewed and re-approved against the new creative direction.
- **Stage 04 — Detailed technical architecture:** **BLOCKED** until the new creative direction and relevant UX decisions are approved. Existing Chat 05 architecture research is retained as reference, not automatically binding for the new direction.
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

## Creative direction reset — 2026-10-12

**User instruction:** Restart creative exploration. All earlier visual and hero decisions are no longer binding. Do not treat the former approved creative specification as the final direction.

### New working hypothesis — NOT APPROVED

- **Working concept:** Reality Engine.
- **World:** surreal physics, impossible architecture, and dreamlike environments.
- **Signature transition:** passing through a tiny opening into an enormous world.
- **Photorealism:** reserved for featured projects and important reveals.
- **Initial visual references for inspiration only:**
  - https://www.webgpu.com/showcase/the-monolith-project/
  - https://akari-light.netlify.app/
- These references are inspiration, not templates to copy.
- Creative exploration should develop visual reference boards and multiple distinct alternatives before proposing a final design. Explore composition, materials, lighting, typography, color, spatial depth, transitions, and how the surreal environment connects to authentic portfolio content.
- The site must remain professional and easy to navigate. Recruiters must quickly understand who SIROSIU is and access projects.
- Maintain accessibility, responsive behavior, performance, and reduced-motion support.

### Superseded creative decisions — historical reference only

The prior Chat 02 specification was approved at the time, but the user has now reset it. These choices are **superseded and must not constrain the new exploration**:
- Nexus × Obsidian / “Spatial Precision”.
- Dark graphite + lavender palette and related token choices.
- Space Grotesk / Inter / IBM Plex Mono typography selection.
- “The Spatial Signature” S-inspired sculpture, its materials and lighting.
- Prior hero interactions, static poster composition, and former motion details.

They may be reconsidered only if the new exploration independently supports them; do not assume approval carries forward.

## Prior UX approval — Chat 03, subject to creative-alignment review

The user previously approved UX proposal v1.0 for the former creative direction. Preserve it as a useful starting point, not as an unchangeable visual specification.

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
2. **Creative direction — reopened and in progress.** Chat 02 must create visual reference boards and multiple distinct alternatives for the Reality Engine hypothesis. The hypothesis is not approved; do not choose a final design yet.
3. **UX and information architecture — previously approved, alignment review required.** After the new creative direction is approved, revisit visual-dependent UX decisions and obtain user approval for changes.
4. **Detailed technical architecture — blocked.** Reassess retained Chat 05 research after creative direction and relevant UX decisions are approved.
5. **Frontend implementation — not authorized.** The earlier local/preview authorization is suspended by this reset. No application code, dependency changes, commits, or deployment changes.
6. **QA and refinement — pending.** Test links, interactions, responsive layouts, accessibility, reduced motion, performance, console/network errors, and browsers after implementation is separately authorized.
7. **Deployment and handover — pending and separately gated.** Verify hosting configuration and obtain explicit production migration authorization only after QA passes.

## Handoff protocol

Each specialist chat must report scope completed, evidence, exact files changed (if any), verification results, proposed versus approved decisions, risks/open questions, and a concise next handoff. The coordinator reconciles the report here before changing stage status. A working hypothesis is not approval; creative approval is not implementation authorization; implementation is not verification.

## Next action

Return to **Chat 02 — Creative Direction & Visual Identity**. Ask it to acknowledge this reset, use the Reality Engine concept only as a working hypothesis, and develop visual reference boards plus multiple distinct creative alternatives. It must compare compositions, materials, lighting, typography, color, spatial depth, transitions, portfolio-content integration, accessibility, responsiveness, and performance. It must not modify the repository, write implementation code, or select a final direction without user approval.

After the user approves a new creative direction, send the revised brief to Chat 03 to review the relevant UX decisions. Keep Chat 05 architecture and Chat 04 implementation blocked until those approvals are recorded.
