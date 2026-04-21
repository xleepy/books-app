# add-to-library

Lets users save a book to their personal library. Appears as a sticky CTA at the bottom of the **Book Detail** screen.

## Design

Corresponds to the `stkBtn` / `stk` frame in the **Book Detail - Reviews** screen in `docs/designs/design-proposal.pen`.

The button is full-width, accent-coloured, and has a soft accent-tinted drop shadow. It shows a `+` (Plus) icon followed by the label "Add to Library".

## API

Saving and removing books is handled via RTK Query mutations from `libraryApi.generated.ts`. There is no local Redux state for saved books — the backend is the source of truth.

| Hook | Effect |
|------|--------|
| `usePostLibraryMutation` | Add a book to the library; invalidates the `Library` cache tag so `LibraryScreen` auto-refetches |
| `useDeleteLibraryByBookIdMutation` | Remove a book from the library; same cache invalidation |

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
