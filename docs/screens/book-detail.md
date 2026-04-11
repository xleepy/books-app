# Book Detail Screen

**Route:** `BookDetail` (stack, param: `{ bookId: string }`)
**File:** [src/pages/book-detail/ui/BookDetailScreen.tsx](../../src/pages/book-detail/ui/BookDetailScreen.tsx)
**Design frame:** _Book Detail - Reviews_ in `docs/designs/design-proposal.pen`

## Purpose

Full-page detail view for a single book. Shows the cover, metadata, synopsis, star rating, and community reviews. The primary CTA saves the book to the user's library.

## Layout

```
┌──────────────────────────┐
│  ← Book title    [avatar]│  ← back navigates to previous screen
├──────────────────────────┤
│  [Book cover — centred]  │
│  Title / Author          │
│  ★★★★☆  4.2 / 5         │
│  Synopsis paragraph…     │
│  ─────────────────────   │
│  Reviews section         │
│    Summary row           │
│    Review cards (scroll) │
└──────────────────────────┘
│  [+ Add to Library]      │  ← sticky CTA, fixed at bottom
└──────────────────────────┘
```

The content area is a `ScrollView` with `paddingBottom: 120` to clear the sticky CTA.

## User flow

1. Arrived from `Discover` (card tap) carrying a `bookId` parameter.
2. The screen looks up the book from `mockBooks` by `bookId`.
3. User reads the synopsis and scrolls through reviews.
4. **Tap "Add to Library"** → dispatches `addBook` to `librarySlice`, then calls `navigation.goBack()` returning to `Discover`.
5. **Tap back arrow / title** → `navigation.goBack()`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Back button | Previous screen (Discover) |
| "Add to Library" | Dispatches to Redux, then `goBack()` |

## Key components used

| Component | Source |
|-----------|--------|
| `BookCover` | `@entities/book/ui/BookCover` |
| `BookMeta` | `@entities/book/ui/BookMeta` |
| `StarRating` | `@shared/ui` |
| `ReviewSection` | `@widgets/review-section` |
| `AddToLibraryButton` | `@features/add-to-library/ui/AddToLibraryButton` |

## State

Dispatches `addBook(book)` from `librarySlice` on CTA press. See [feature docs](../../src/features/add-to-library/README.md).
