# stater

[![CI](https://github.com/morqan/stater/actions/workflows/ci.yml/badge.svg)](https://github.com/morqan/stater/actions/workflows/ci.yml)

A quick-start template for a new frontend project — **Vite + React + TypeScript**.

Rebuilt in 2026 from the original 2019 Gulp + Bower boilerplate. One bundler (Vite)
now replaces the whole task-runner pipeline: dev server, HMR, bundling, minification,
source maps and content hashing all come out of the box.

## Stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Build tool   | [Vite 8](https://vite.dev) (Rolldown)   |
| UI           | React 19 + TypeScript                   |
| Routing      | React Router 7 (data router)            |
| Styling      | CSS Modules (`*.module.css`)            |
| Lint/format  | [Biome](https://biomejs.dev)            |

## Requirements

- Node **>= 20.19** (see `.nvmrc` — recommended: 22 LTS)
- Yarn (or npm / pnpm)

## Getting started

```bash
yarn install      # install dependencies
yarn dev          # start the dev server at http://localhost:5173
```

## Scripts

| Script           | What it does                                  |
| ---------------- | --------------------------------------------- |
| `yarn dev`       | Dev server with hot module replacement        |
| `yarn build`     | Type-check, then build to `dist/`             |
| `yarn preview`   | Serve the production build locally            |
| `yarn typecheck` | Run `tsc --noEmit`                            |
| `yarn lint`      | Lint + format check with Biome                |
| `yarn format`    | Auto-format the codebase with Biome           |

## Quality gates

Two automated layers keep `master` clean:

- **Pre-commit hook** ([husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)) —
  on every `git commit`, Biome checks and auto-fixes the staged files. Installed automatically by
  the `prepare` script on `yarn install`. Bypass once with `git commit --no-verify` if you must.
- **CI** (GitHub Actions, `.github/workflows/ci.yml`) — on every push and pull request, runs
  install → lint → typecheck → build on a clean runner. Can't be skipped.
- **Dependency updates** ([Dependabot](https://docs.github.com/code-security/dependabot), `.github/dependabot.yml`) —
  weekly grouped PRs for npm and GitHub Actions updates, each validated by CI.

## Project structure

```
src/
├─ main.tsx              # entry point: mounts React + router
├─ routes.tsx            # route table (single source of truth)
├─ components/
│  ├─ ErrorBoundary.tsx  # shown when a route throws
│  └─ Layout.tsx         # shared shell with <Outlet />
├─ routes/
│  ├─ Home.tsx           # example page
│  ├─ About.tsx          # example page
│  └─ NotFound.tsx       # catch-all 404 page
└─ styles/
   └─ global.css         # global resets and base styles
```

Add a page: create `src/routes/MyPage.tsx`, then register it in `src/routes.tsx`.

## Switching package manager

This template ships a `yarn.lock`. To use a different manager, delete the lockfile and run
`npm install` or `pnpm install` instead.

## Adding tests (optional)

Tests are intentionally not bundled. When you need them:

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add `"test": "vitest"` to `scripts`. To type-check the `test` options, import `defineConfig`
from `vitest/config` (not `vite`) and add:

```ts
import { defineConfig } from 'vitest/config'
// ...
test: { environment: 'jsdom', globals: true }
```

## Roadmap

- [x] GitHub Actions CI (install → lint → typecheck → build)
