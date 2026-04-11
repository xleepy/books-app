# Discover Screen

**Route:** `Discover` (tab 1)
**File:** [src/pages/discover/ui/DiscoverScreen.tsx](../../src/pages/discover/ui/DiscoverScreen.tsx)
**Design frame:** _Discover - Swipe_ in `docs/designs/design-proposal.pen`

## Purpose

The entry point of the app. Users browse book recommendations by swiping through a deck of cards — one book per card — and signal interest via gesture or action buttons.

## Layout

```
┌─────────────────────────┐
│  Header: "Discover"  ⚙  │  ← avatar navigates to Progress
│  (avatar + filter icon) │
├─────────────────────────┤
│                         │
│      Book card          │  ← swipeable, tappable
│      (cover + meta)     │
│                         │
├─────────────────────────┤
│   [✕]  [🔖]  [♥]       │  ← SwipeActions row
└─────────────────────────┘
│  Pill tab bar           │
└─────────────────────────┘
```

## User flow

1. The screen mounts with a deck of book cards (`BookSwipeStack` widget).
2. **Swipe right** or tap the heart button → likes the book (adds to library intent).
3. **Swipe left** or tap the X button → passes on the book, advances to the next card.
4. **Tap the bookmark** button → saves for later.
5. **Tap the card** → navigates to `BookDetail` with the tapped book's `bookId`.
6. **Tap the avatar** in the header → navigates to `Progress`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Card tap | `BookDetail` (`{ bookId: string }`) |
| Avatar press | `Progress` |

## Key components used

| Component | Source |
|-----------|--------|
| `BookSwipeStack` | `@widgets/book-swipe-stack` |
| `ScreenHeader` | `@pages/_shared/ScreenHeader` |
| `SwipeableCard` | `@features/swipe-book/ui/SwipeableCard` |
| `SwipeActions` | `@features/swipe-book/ui/SwipeActions` |

## State

Swipe position and current deck index are managed by `swipeSlice` (`@features/swipe-book/model/swipeSlice`). See [feature docs](../../src/features/swipe-book/README.md).
