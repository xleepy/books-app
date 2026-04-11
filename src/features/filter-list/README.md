# filter-list

A horizontally scrollable row of filter chips. Used wherever a screen needs a category/tab selector that does not trigger navigation.

## Design

Matches the `filterRow` pattern visible on two screens in `docs/designs/design-proposal.pen`:

| Screen | Filters |
|--------|---------|
| **Discussion Threads** | All · Popular · Recent · My Threads |
| **Challenges & Competitions** | Active · Monthly · Yearly · Leaderboard |

Active chip uses the accent fill; inactive chips use the secondary background.

## UI Component — `FilterRow`

**File:** [ui/FilterRow.tsx](ui/FilterRow.tsx)

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `string[]` | — | Ordered list of filter labels to render |
| `initial` | `string` | first item | Label of the initially selected chip |
| `onChange` | `(filter: string) => void` | — | Called with the newly selected label on each change |

**Behaviour**
- Active state is managed locally with `useState`; the parent is notified via `onChange`.
- Renders inside a horizontal `ScrollView` with `showsHorizontalScrollIndicator={false}`, so long lists scroll off-screen naturally.
- Delegates chip rendering and active/inactive styling to the shared `FilterChip` component (`@shared/ui`).
