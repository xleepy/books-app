# Frontend Architecture Guide — Feature-Sided Design (FSD)

This document establishes the architecture patterns for the books-app frontend. All contributors should follow these guidelines.

---

## Directory Structure

```
src/
├── app/               # App-level infrastructure (providers, navigation, types)
├── entities/         # Shared domain objects with UI components
├── features/         # Self-contained feature modules (isolated logic + UI)
├── pages/            # Page compositions (assemble widgets/features)
├── shared/           # Shared utilities, UI primitives, API layer
├── store/             # Redux store configuration
└── widgets/          # Shared composite UI components
```

---

## Core Principle

**Code is organized by feature/slice, not by technical role.** Each layer has a clear purpose and boundaries.

---

## Layers

### `entities/` — Shared Domain Objects

Domain objects used across multiple features. Each entity lives in its own subdirectory.

```
entities/
└── {domain}/
    ├── model/types.ts       # Domain type re-exports (from API)
    ├── ui/                  # UI representation(s) of this domain
    └── mock/               # Mock data for testing (optional)
```

**Rules:**
- Entities export types from `shared/api/` (not from `store/api/`)
- UI components in `entities/` represent a single domain object
- Examples: `BookCover`, `ThreadCard`, `ReviewCard`, `ChallengeCard`
- Entities may re-export types from `shared/api/`

**Correct:**
```typescript
// entities/discussion/model/types.ts
export type { Thread, ThreadDetail, ThreadReply } from '@shared/api/discussionsApi.generated';

// entities/discussion/ui/ThreadCard.tsx
import type { Thread } from '@shared/api/discussionsApi.generated';
import { Avatar } from '@shared/ui';
import { BookCover } from '@entities/book/ui/BookCover';
```

**Incorrect:**
```typescript
// NEVER import from @store/api/ in entities or features
import { Thread } from '@store/api/discussionsApi.generated'; // ← bad
```

---

### `features/` — Self-Contained Feature Modules

A feature is a complete, isolated piece of functionality. It should be usable without any other feature's knowledge.

```
features/
└── {feature-name}/
    ├── model/               # Redux slices, selectors, business logic
    │   └── {feature}Slice.ts
    └── ui/                  # Feature-specific UI components
        └── {FeatureUI}.tsx
```

**Rules:**
- Features may only import from: `shared/`, `entities/`, `app/`, other features (only when truly shared)
- Features must NOT import from `pages/` or other `features/` if the coupling is non-essential
- Redux slices inside `features/` should use entity types from `entities/` (not from `store/`)
- Example features: `swipe-book`, `track-progress`, `add-to-library`, `filter-list`, `user-avatar`

**Correct:**
```typescript
// features/swipe-book/model/swipeSlice.ts
import { booksApi } from '@shared/api/booksApi.generated'; // ← good
import { api } from '@store/api/apiSlice';                  // for store config only
```

**Incorrect:**
```typescript
// features/auth/model/authSlice.ts
import { ThreadCard } from '@entities/discussion/ui/ThreadCard';  // ← bad: feature doesn't own threads
```

---

### `widgets/` — Shared Composite Components

Composite UI components used by multiple pages or features. Widgets assemble entities and shared UI primitives.

```
widgets/
└── {widget-name}/
    └── ui/{WidgetName}.tsx
```

**Rules:**
- Widgets may import from: `entities/`, `shared/ui/`, other widgets, `app/`
- Widgets should NOT import from `pages/`
- Widgets should NOT import from `features/` (they're shared, not feature-specific)
- Example widgets: `BadgesRow`, `ReadingCard`, `ReviewSection`, `LeaderboardSection`, `StreakCard`

**Correct:**
```typescript
// widgets/review-section/ui/ReviewSection.tsx
import { useGetBooksByIdReviewsQuery } from '@shared/api/reviewsApi.generated';
import { ReviewCard } from '@entities/review/ui/ReviewCard';
import { colors } from '@shared/theme';
```

---

### `pages/` — Page Compositions

Pages assemble widgets, features, and entities. Pages are the entry points for navigation routes.

```
pages/
└── {feature}/
    ├── model/               # Page-specific types (optional)
    └── ui/
        ├── {Page}Screen.tsx
        └── components/      # Page-specific sub-components
            ├── ComponentA.tsx
            └── ComponentB.tsx
```

**Rules:**
- Pages may import from: `entities/`, `widgets/`, `features/`, `shared/`, `app/`
- Page-specific UI components should live in `pages/{feature}/ui/components/`
- Shared page utilities (e.g., `Screen`, `ScreenHeader`) belong in `shared/ui/`, NOT in `pages/_shared/`
- Pages should NOT import from other pages

**Page component split example:**
```typescript
// pages/discussions/ui/components/ThreadHeader.tsx      ← page-specific, isolated
// pages/discussions/ui/components/ReplyItem.tsx           ← page-specific, isolated
// pages/discussions/ui/ThreadDetailScreen.tsx             ← composes the above
```

---

### `shared/` — Shared Utilities

Generic, reusable code with no business logic. This is the only place for truly cross-cutting concerns.

```
shared/
├── api/                     # RTK Query API definitions (generated)
│   └── {entity}Api.generated.ts
├── ui/                      # Generic UI primitives
│   ├── Avatar.tsx
│   ├── Screen.tsx
│   ├── ScreenHeader.tsx
│   └── ...
├── theme/                   # Design tokens
│   ├── colors.ts
│   ├── fontFamily.ts
│   └── ...
└── lib/                     # Utility functions
    └── supabase.ts
```

**Rules:**
- `shared/api/` is the ONLY place for RTK Query API files
- API files are generated by `npm run codegen` — do NOT manually edit generated files
- If you need to customize API behavior, create a wrapper or edit `openapi-config.js`
- All imports from `shared/api/` use the `@shared/api/` alias

**API generation:**
```bash
# API files are generated from the backend OpenAPI spec
npm run codegen
```

The codegen config (`openapi-config.js`) outputs to `src/shared/api/`. After generation, re-export types in `entities/{domain}/model/types.ts` if needed.

---

### `store/` — Redux Configuration

The Redux store setup. This directory should contain only store infrastructure.

```
store/
├── api/apiSlice.ts          # RTK Query base API definition (DO NOT move)
└── store.ts                 # Store configuration
```

**Rules:**
- `store/api/apiSlice.ts` MUST stay in `store/` — it is the base for all generated APIs
- Generated API files live in `shared/api/`, not here
- Widget tests may import `api` from `@store/api/apiSlice` for test store setup

---

## Import Rules Summary

| Source | Can Import |
|--------|-----------|
| `entities/` | `shared/`, `entities/`, `app/` |
| `features/` | `shared/`, `entities/`, `app/` |
| `widgets/` | `shared/`, `entities/`, `app/` |
| `pages/` | `shared/`, `entities/`, `widgets/`, `features/`, `app/` |
| `shared/` | `shared/` (internal), `app/` |

**Never import from:**
- `pages/` → `pages/` (cross-page coupling)
- `features/` → `pages/`
- `store/api/` (except `apiSlice.ts` for store config, or in tests)

---

## Adding a New Entity

1. Create `src/entities/{name}/model/types.ts` — re-export types from `shared/api/`
2. Create `src/entities/{name}/ui/` — add UI components that render the domain object
3. Update `openapi-config.js` if adding new API endpoints

**Example:**
```bash
# 1. Create directory
mkdir -p src/entities/author/model src/entities/author/ui

# 2. Create types (re-export from shared/api if API exists)
# entities/author/model/types.ts
export type { Author } from '@shared/api/authorsApi.generated';

# 3. Create UI component
# entities/author/ui/AuthorCard.tsx
import type { Author } from '@shared/api/authorsApi.generated';
import { Avatar } from '@shared/ui';
// ...
```

---

## Adding a New Feature

1. Create `src/features/{name}/model/` and `src/features/{name}/ui/`
2. Add Redux slice if feature needs state management
3. Only import from `shared/`, `entities/`, `app/`

**Example:**
```bash
mkdir -p src/features/bookmarks/model src/features/bookmarks/ui
```

---

## Adding a New Page

1. Create `src/pages/{name}/ui/{Name}Screen.tsx`
2. If the page has sub-components, create a `components/` directory
3. Import from `shared/ui/Screen` and `shared/ui/ScreenHeader` for page layout
4. Do NOT create `pages/_shared/` — shared page utilities go in `shared/ui/`

---

## API Layer Guidelines

### Generated APIs

All RTK Query APIs are generated from the backend OpenAPI spec via:

```bash
npm run codegen
```

The config is in `openapi-config.js`. Output goes to `src/shared/api/`.

### Customizing Generated APIs

Do NOT edit files in `src/shared/api/*.generated.ts`. Instead:

1. **Adjust the OpenAPI config** (`openapi-config.js`) to control what gets generated
2. **Override in a wrapper file** if you need custom query function behavior
3. **Fix backend schema** if the generated shapes don't match what the frontend expects

### API Import Path

```typescript
// ✅ Correct — import from @shared/api/
import { useGetThreadsQuery } from '@shared/api/discussionsApi.generated';
import type { Thread } from '@shared/api/discussionsApi.generated';

// ❌ Incorrect — @store/api/ is only for store infrastructure
import { api } from '@store/api/apiSlice'; // only for store config / tests
```

### Re-exporting Types in Entities

Always re-export domain types from `entities/{domain}/model/types.ts`:

```typescript
// entities/discussion/model/types.ts
export type { Thread, ThreadDetail, ThreadReply } from '@shared/api/discussionsApi.generated';
```

This creates a stable import boundary — features and widgets import from the entity, not directly from the API.

---

## Testing Guidelines

- Test files live next to the code they test: `ui/Component.test.tsx`, `model/Slice.test.ts`
- For widget tests that need the Redux store, import `api` from `@store/api/apiSlice` to build the test store
- Mock API responses using RTK Query's `factory.setup()` pattern

---

## Code Review Checklist

Before submitting a PR, verify:

- [ ] No imports from `@store/api/` except `apiSlice.ts` for store config
- [ ] All API imports use `@shared/api/`
- [ ] No cross-page imports (`pages/` → `pages/`)
- [ ] Page-specific components are in `pages/{feature}/ui/components/`
- [ ] Shared page utilities are in `shared/ui/`, not `pages/_shared/`
- [ ] Features don't import from other features unless truly shared
- [ ] Types re-exported from `entities/{domain}/model/types.ts` if used across features/widgets
