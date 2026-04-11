# swipe-book

Tinder-style book discovery on the **Discover** screen. Users swipe through a deck of book cards and signal interest via gesture or action buttons.

## Design

Corresponds to the **Discover - Swipe** screen in `docs/designs/design-proposal.pen`.

The card occupies the full content area below the header. Three action buttons sit below it:

| Button | Icon | Meaning |
|--------|------|---------|
| Pass   | X    | Skip the book |
| Bookmark | Bookmark | Save for later |
| Like   | Heart (accent fill) | Add to library / strong interest |

## State — `swipeSlice`

**File:** [model/swipeSlice.ts](model/swipeSlice.ts)

| Field | Type | Description |
|-------|------|-------------|
| `currentIndex` | `number` | Index of the card currently on top |
| `totalCards` | `number` | Total number of cards in the deck |

### Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `nextCard` | — | Advance index; wraps back to `0` at the end of the deck |
| `resetDeck` | — | Reset `currentIndex` to `0` |
| `setTotalCards` | `number` | Update deck size (e.g. after a data fetch) |

## UI Components

### `SwipeableCard`

**File:** [ui/SwipeableCard.tsx](ui/SwipeableCard.tsx)

A gesture-driven wrapper that animates any content as a swipeable card.

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Card content |
| `onSwipeLeft` | `() => void` | Called when the card is dismissed left (pass) |
| `onSwipeRight` | `() => void` | Called when the card is dismissed right (like) |
| `onTap` | `() => void` | Called on a tap (opens book detail) |

**Behaviour**
- Threshold: **25 % of screen width** — drags below this snap back with a spring.
- On commit: card flies off-screen (`withTiming`, 250 ms) then the callback fires and position resets.
- Rotation: ±12° interpolated across the full screen width, giving a natural "flick" feel.
- Opacity fades from `1 → 0.4` as the card approaches the edge.
- Pan and Tap gestures are composed with `Gesture.Race` so a quick tap is never mis-read as a drag.

### `SwipeActions`

**File:** [ui/SwipeActions.tsx](ui/SwipeActions.tsx)

The three-button row rendered below the card, matching the `actionsRow` frame in the design.

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `onPass` | `() => void` | Triggered by the X button (56 × 56) |
| `onBookmark` | `() => void` | Triggered by the Bookmark button (48 × 48) |
| `onLike` | `() => void` | Triggered by the Heart button (56 × 56, accent background) |
