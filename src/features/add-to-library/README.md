# add-to-library

Lets users save a book to their personal library. Appears as a sticky CTA at the bottom of the **Book Detail** screen.

## Design

Corresponds to the `stkBtn` / `stk` frame in the **Book Detail - Reviews** screen in `docs/designs/design-proposal.pen`.

The button is full-width, accent-coloured, and has a soft accent-tinted drop shadow. It shows a `+` (Plus) icon followed by the label "Add to Library".

## State — `librarySlice`

**File:** [model/librarySlice.ts](model/librarySlice.ts)

| Field | Type | Description |
|-------|------|-------------|
| `savedBooks` | `Book[]` | The user's saved book collection |

### Actions

| Action | Payload | Effect |
|--------|---------|--------|
| `addBook` | `Book` | Appends the book if it is not already saved (deduplication by `id`) |
| `removeBook` | `string` (book id) | Removes the book with the given id |

## UI Component — `AddToLibraryButton`

**File:** [ui/AddToLibraryButton.tsx](ui/AddToLibraryButton.tsx)

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `() => void` | — | Called when the button is tapped |
| `label` | `string` | `'Add to Library'` | Button text (overridable for alternate states) |

**Styling**
- Height: 52, border-radius: 26 (pill shape)
- Background: `colors.accent`
- Drop shadow: `#C45A3C30` offset `(0, 4)` blur 16
