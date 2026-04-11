# Library Screen

**Route:** `Library` (tab 3)
**File:** [src/pages/library/ui/LibraryScreen.tsx](../../src/pages/library/ui/LibraryScreen.tsx)
**Design frame:** _My Library_ in `docs/designs/design-proposal.pen`

## Purpose

Personal reading hub. Shows the user's high-level reading stats, the book currently in progress, and a grid of saved books.

## Layout

```
┌──────────────────────────────┐
│  "My Library"                │
│  subtitle: "N books collected"│  ← avatar navigates to Progress
├──────────────────────────────┤
│  [12 Finished] [3 Reading]   │
│  [N Wishlist]                │  ← stat tiles row
├──────────────────────────────┤
│  Currently Reading  See all  │
│  ┌──────────────────────┐    │
│  │ Atomic Habits  68%   │    │  ← ReadingCard widget
│  └──────────────────────┘    │
├──────────────────────────────┤
│  Saved Books        See all  │
│  ┌───────┐  ┌───────┐       │
│  │ cover │  │ cover │       │  ← 2-column book grid
│  │ title │  │ title │       │
│  └───────┘  └───────┘       │
└──────────────────────────────┘
│  Pill tab bar                │
└──────────────────────────────┘
```

## User flow

1. Screen reads `savedBooks` from `librarySlice` via `useSelector`.
2. **Stats row** — "Finished" and "Reading" counts are hardcoded; "Wishlist" reflects `savedBooks.length` from Redux.
3. **Currently Reading card** — shows _Atomic Habits_ at 68 % progress (hardcoded; will be driven by `track-progress` slice when wired up).
4. **Saved Books grid** — renders the first 4 books from `savedBooks` (falls back to `mockBooks` when the list is empty). Tapping a book would navigate to `BookDetail` (not yet wired).
5. **Tap avatar** → navigates to `Progress`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Avatar press | `Progress` |
| Book tile tap | `BookDetail` (not yet implemented) |

## Key components used

| Component | Source |
|-----------|--------|
| `ScreenHeader` | `@pages/_shared/ScreenHeader` |
| `ReadingCard` | `@widgets/reading-card` |
| `BookCover` | `@entities/book/ui/BookCover` |

## State

Reads `state.library.savedBooks` from `librarySlice`. Total book count is `savedBooks.length + 23` (mock offset for pre-seeded books). See [feature docs](../../src/features/add-to-library/README.md).
