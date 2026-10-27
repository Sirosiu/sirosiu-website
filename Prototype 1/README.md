# SIROSIU

**SIROSIU is a personal project exploring engineering, technology, and creative experimentation.** This repository contains the website code behind [sirosiu.com](https://sirosiu.com).

The site is an ongoing work in progress. Its direction brings together a distinctive digital experience, visual design, interaction, and ideas I'm exploring along the way.

## Tech stack

The current website prototype uses:

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei

The repository root contains the deployment/build wrapper; the isolated website prototype lives in `prototype/`.

## Run the prototype locally

Requirements: a current Node.js LTS release and npm.

```bash
cd prototype
npm ci
npm run dev
```

Vite prints the local development URL in the terminal. Open that URL in your browser.

To create and preview a production build of the prototype:

```bash
npm run build
npm run preview
```

Run those commands from `prototype/`.

## Build for deployment

From the repository root:

```bash
npm install
npm run build
```

The root build script installs the prototype dependencies, builds the prototype, and copies its output into the root `dist/` directory.

For Cloudflare Pages, the repository's current build setup expects the production build to run from the `main` branch and publish the `dist` directory. Verify the project's Cloudflare Pages settings before changing hosting or DNS configuration.

## Project status

SIROSIU is actively evolving. Features and visual experiments should be treated as work in progress unless they are present in the current deployed version.

## Links

- **Live website:** https://sirosiu.com
- **Repository:** https://github.com/Sirosiu/sirosiu-website

---

Built and maintained as part of the ongoing SIROSIU journey.
