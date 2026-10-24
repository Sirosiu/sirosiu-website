# Technical Architecture

## Status

Provisional recommendations, not implementation authorization.

## Starting point to evaluate

- React + TypeScript + Vite are a reasonable candidate given the existing repository experience. Reconfirm before scaffolding runtime files.
- Prefer CSS and browser-native interaction. Consider Three.js / React Three Fiber / Drei only when an approved concept benefits from real-time 3D.
- Keep content, page sections, shared UI, and optional scenes modular. Keep important content independent of WebGL.
- Start as a static frontend unless a concrete requirement justifies a backend.
- Add only dependencies with a documented purpose.

## Future app boundary

The replacement is intended to live under `site-next/`, independent of the existing root and nested app copies. Those copies remain untouched while research proceeds. Do not change root build/deployment behavior.

## Decisions to make later

Framework/configuration, component boundaries, rendering strategy, content model, animation approach, asset pipeline, testing approach, measurable performance budgets, and hosting build settings. Verify hosting configuration before any release proposal.
