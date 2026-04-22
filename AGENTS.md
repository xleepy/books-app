# AGENTS.md — books-app (Frontend)

This file is for AI coding agents working on the books-app React Native / Expo frontend. It links all project guides and provides quick orientation.

---

## Project Overview

React Native / Expo app for discovering, tracking, and discussing books. Uses Redux Toolkit + RTK Query for server state, React Navigation for routing, and MSW for mock API in development.

**Stack**: React Native 0.81, Expo 54, TypeScript 6.0, Redux Toolkit, RTK Query, React Navigation

---

## Guides

| Guide | Purpose |
|-------|---------|
| [Feature-Sided Design (FSD) Guide](./docs/FSD_GUIDE.md) | Directory structure, layer boundaries (`entities/`, `features/`, `widgets/`, `pages/`, `shared/`), import rules |
| [Redux & RTK Query Guide](./docs/REDUX_GUIDE.md) | Server state management, mutations with `.unwrap()`, cache invalidation, local slices vs RTK Query |
| [React Patterns Guide](./docs/REACT_GUIDE.md) | Component patterns from react.dev: data loading vs presentation, avoiding unnecessary effects, form state, waiting for data |

Read the relevant guide before making changes to:
- **Directory structure or imports** → FSD Guide
- **API layer, mutations, caching** → Redux & RTK Guide
- **Component design, effects, form state** → React Patterns Guide

---

## Quick Commands

```bash
npm start              # Expo dev server
npm run start:mock     # Expo with MSW mocks (no backend needed)
npm test               # Jest tests
npm run typecheck      # TypeScript check
npm run codegen        # Regenerate RTK Query APIs from backend OpenAPI
```

---

## Architecture at a Glance

```
src/
├── app/              # Navigation, providers, root types
├── entities/         # Domain objects (Book, Thread, Review, etc.)
├── features/         # Self-contained features (auth, swipe-book, track-progress)
├── pages/            # Screen components (assemble widgets + features)
├── shared/           # UI primitives, API layer, theme, utilities
├── store/            # Redux store config + base API slice
└── widgets/          # Composite UI (ReadingCard, ReviewSection, etc.)
```

---

## Design Workflow (Pencil)

We use [Pencil](https://docs.pencil.dev/) for UI design drafts. The design file lives at:

```
docs/designs/design-proposal.pen
```

### When to use Pencil

- **New screens or flows** — draft layout before writing code
- **Design review** — iterate visually with stakeholders
- **Component anatomy** — map reusable widgets from design to FSD layers

### Working with `.pen` files

- Pencil files are **code-native** JSON. AI agents can read and modify them via MCP tools.
- The file is version-controlled alongside the codebase.
- See the official [`.pen` format reference](https://docs.pencil.dev/for-developers/the-pen-format) for the full schema.

### Design → Code Workflow

1. **Draft in Pencil first** — Use frames, text, and icons to rough out the screen. Prefer flexbox layout (`layout: "vertical"` / `"horizontal"`) over absolute positioning.
2. **Use variables** — Reference design tokens like `$accent`, `$bg-primary`, `$font-primary` instead of hardcoding hex values. This keeps designs consistent with the app's theme.
3. **Generate code** — Once the draft looks right, ask the agent to generate the React Native screen/component code from the design.
4. **Refine in code** — Pencil drafts are approximations. Final polish (animations, dynamic data, exact spacing) happens in the actual component.

### Pencil Conventions for This Project

- **Frame naming** — Use descriptive names: `heroCard`, `leaderSec`, `joinBtn`
- **Screen frames** — Each screen is a top-level frame with `width: 390` (iPhone layout)
- **Icons** — Use `lucide` icon font (matches our `lucide-react-native` dependency)
- **Text sizing** — Use `textGrowth: "fixed-width"` for multi-line descriptions; default `"auto"` for single-line labels
- **Sizing** — Prefer `fill_container` and `fit_content` over hardcoded dimensions
- **Colors** — Only use documented theme variables (see `src/shared/theme/index.ts`)

### Screens Currently in `design-proposal.pen`

| Frame | Screen | Status |
|---|---|---|
| `JB7eP` | Discover - Swipe | Draft |
| `RRrEc` | Book Detail - Reviews | Draft |
| `x0upN` | Discussion Threads | Draft |
| `fTp4Y` | My Library | Draft |
| `uyE9s` | Reading Stats & Level | Draft |
| `Wg9V3` | Challenges & Competitions | Draft |
| `ur9RF` | User Settings | Draft |
| `rpCyx` | Challenge Detail | **NEW — with leaderboard** |
| `1Utr4` | Create Challenge | **NEW — template picker + form** |

---

## Key Conventions

1. **Never edit generated files manually.** Files in `src/shared/api/*.generated.ts`, `src/generated/prisma/`, or any file with a `.generated.` suffix are produced by codegen tools. Always regenerate them via the appropriate command (`npm run codegen`, `npm run db:generate`, etc.). Manual edits will be lost on the next regeneration and can introduce type mismatches.
2. **Mutations must use `.unwrap()`** with `try/catch` for error handling
3. **Separate data loading from presentation** — Screen loads data, Form/Widget renders UI
4. **Don't use `useEffect` to sync props → state** — pass initial values as props, use `key` prop to reset
5. **Wait for all data before rendering** — show `ActivityIndicator` while any required query is loading
6. **Import rules** follow the FSD layer hierarchy; check the FSD Guide table

---

## When Changing the Backend API

If you modify backend routes or response shapes:

1. Ensure the backend server is running at `http://localhost:3000`
2. Run `npm run codegen` in the frontend
3. The generated files will update automatically
4. Run `npm run typecheck` to verify frontend call sites

---

## Related

- Backend project: `../books-app-backend/`
- Backend guides: See `../books-app-backend/AGENTS.md`
