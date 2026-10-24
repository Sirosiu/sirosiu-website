# Decisions

Record durable decisions only after the user approves them. Recommendations stay provisional until then.

## Confirmed for this reset

| Decision | Basis |
|---|---|
| Build a fresh direction; Prototype 1 is not the design specification. | User instruction and current project plan. |
| Keep this work inside `Prototype 2/`; put the future replacement app in `site-next/`. | User instruction and workspace plan. |
| Preserve the existing app copies while the new project is planned. | Current scope; no cleanup authorized. |
| Do not start implementation code in this scaffold phase. | User requested files/folders/project setup and said code comes later. |
| Keep production, hosting, DNS, and deployment unchanged. | Project safety boundary. |
| Use GitHub project documents as shared memory; chats do not sync their private histories automatically. | Project workflow. |

## Provisional recommendations

- React + TypeScript + Vite as a candidate stack.
- CSS/native effects first, optional 3D only when justified.
- Static frontend initially; no backend unless a real need emerges.
- A focused portfolio structure based on verified content.

## Open decisions

Creative concept, page structure, content, visual system, exact stack/configuration, 3D use, asset choices, QA budgets, deployment settings.

## Superseded historical choices

Any earlier approved Prototype 1 style, specific visual concept, hero scene, palette, typography, transitions, or app-root assumption does not constrain this reset. See the archived notes in `docs/archive/`.

## Change log

| Date | Decision |
|---|---|
| 2026-10-24 | Reset creative direction and establish the isolated `Prototype 2/site-next/` workspace. |
