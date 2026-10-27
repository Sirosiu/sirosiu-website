# SIROSIU Website — Prototype 2

## Mission and scope

Create a distinctive, technically strong SIROSIU website from a fresh direction. Prototype 1 and the copied applications are historical material, not design specifications. This workspace is `Github/sirosiu-website/Prototype 2/`; keep all project changes inside it.

The new application will live in `site-next/`. The existing app copies remain untouched while the new structure is planned. Do not clean up, move, or delete them without a separate explicit instruction.

## Source of truth

Before work, inspect `git status` and the current branch, then read:

- `PROJECT_STATE.md`
- `docs/PROJECT_BRIEF.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`
- `docs/CHAT_WORKFLOW.md` and `docs/WORK_LOG.md`
- `docs/handoffs/CURRENT_HANDOFF.md`
- The relevant design, content, architecture, reference, asset, and QA documents

User instructions and the latest approved entries in these files supersede archived notes and chat memory. Specialist chats make recommendations; Project HQ/user approval turns them into decisions.

## Working rules

- Do not write website implementation code until the user starts that phase. When authorized, put new application code in `site-next/`.
- Keep project content factual. Do not invent work, skills, credentials, dates, outcomes, or contact details.
- Keep essential content usable without WebGL; preserve responsive layout, semantic HTML, keyboard access, visible focus, and reduced-motion support.
- Prefer CSS and native browser capabilities. Add 3D or dependencies only for a specific approved purpose.
- The user approved a source-first, selective-reuse strategy: when implementation begins, prefer suitable existing repositories/components for chosen needs instead of recreating every reference feature. Verify source, license, compatibility, and attribution; record them in `docs/ASSET_REGISTER.md` before reuse. A public URL does not grant reuse rights. Do not use assets or code with unclear rights or make purchases without explicit approval.
- Never copy an entire reference site or repository into this project.
- Do not overwrite unrelated changes or expose credentials/private configuration.
- Do not commit, push, merge, deploy, change DNS, or alter production settings unless the user explicitly asks.

## Handoff

After every meaningful research, planning, implementation, or review task, append a concise entry to `docs/WORK_LOG.md`. At a meaningful phase boundary, also update `PROJECT_STATE.md`, the relevant decision/roadmap record, and `docs/handoffs/CURRENT_HANDOFF.md`. Report files changed, checks actually run, decisions made, open questions, and the next task. Never claim checks that were not performed.
