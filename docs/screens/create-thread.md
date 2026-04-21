# Create Thread Screen

**Route:** `CreateThread` (modal, no params)
**File:** [src/pages/discussions/ui/CreateThreadScreen.tsx](../../src/pages/discussions/ui/CreateThreadScreen.tsx)
**Design frame:** _Create Thread_ in `docs/designs/design-proposal.pen`

## Purpose

Modal form for composing a new discussion thread. Supports a title, rich body text, an optional linked book (via inline search), and a spoiler toggle.

## Layout

```
┌──────────────────────────────┐
│  [✕]  New Thread     [Post]  │  ← X dismisses modal; Post disabled until title+body filled
├──────────────────────────────┤
│  ── error banner (if any) ── │
│                              │
│  Title                       │
│  ┌──────────────────────────┐│
│  │ What's your thread about?││  ← max 200 chars; character counter
│  └──────────────────────────┘│
│                         3/200│
│                              │
│  Body                        │
│  ┌──────────────────────────┐│
│  │ Share your thoughts…     ││  ← multiline; max 10,000 chars
│  │                          ││
│  └──────────────────────────┘│
│                       42/10000│
│                              │
│  Link a Book  (optional)     │
│  ┌──────────────────────────┐│ ← selected book card (when a book is chosen)
│  │ [cover] Title            ││
│  │         Author       [✕] ││ ← ✕ deselects
│  └──────────────────────────┘│
│  📖  Search for a book       │  ← tapping opens the inline picker
│                              │
│  ── picker (when open) ───── │
│  ┌──────────────────────────┐│
│  │ 🔍 Search…      [Cancel] ││  ← autoFocused search bar
│  ├──────────────────────────┤│
│  │ [cover] Title            ││  ← result row
│  │         Author           ││
│  ├──────────────────────────┤│
│  │ …                        ││
│  └──────────────────────────┘│
│                              │
│  Contains Spoilers           │
│  Warn readers…     [toggle]  │  ← Switch (default off)
└──────────────────────────────┘
```

## User flow

1. Opens as a modal pushed from `DiscussionsScreen` (`+` button).
2. User types a **title** (required, max 200) and **body** (required, max 10,000).
3. **Link a Book** section:
   - Tap `Search for a book` → inline picker expands; search bar auto-focuses.
   - Typing 2+ characters fires `GET /books?q=<text>&limit=6` with 300ms debounce.
   - Results appear as a scrollable list (cover + title + author). Tapping a result selects it and closes the picker.
   - Selected book shows as a compact card with a `×` dismiss button. `Change book` re-opens the picker.
   - `Cancel` collapses the picker without changing the selection.
   - If no book is selected, `bookId` is `null` (creates a general/non-book-linked thread).
4. **Spoiler toggle** — `Switch` marks the thread as containing spoilers; recipients see a warning badge on the card.
5. **Post button** — enabled only when both title and body are non-empty. Calls `POST /threads`; on success, navigates back (the `Feed` RTK tag is invalidated, refreshing the list). On failure, shows an error banner.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| ✕ button | `navigation.goBack()` |
| Successful post | `navigation.goBack()` |

## Key components used

| Component | Source |
|-----------|--------|
| `BookCover` | `@entities/book/ui/BookCover` |

## API

| Hook | Endpoint | Notes |
|------|----------|-------|
| `usePostThreadsMutation` | `POST /threads` | Body: `{ title, body, bookId?, spoiler }` |
| `useGetBooksQuery` | `GET /books?q=&limit=6` | Skipped until `debouncedQ.length >= 2` |

## State

All local — no Redux slice.

| Variable | Type | Purpose |
|----------|------|---------|
| `title` | `string` | Controlled title input |
| `body` | `string` | Controlled body input |
| `spoiler` | `boolean` | Spoiler toggle |
| `selectedBook` | `Book \| null` | Currently linked book |
| `pickerOpen` | `boolean` | Whether the book picker is expanded |
| `bookSearch` | `string` | Controlled search input |
| `debouncedQ` | `string` | Debounced value of `bookSearch` (300ms) |
| `error` | `string \| null` | Submission error message |
