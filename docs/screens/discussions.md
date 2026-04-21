# Discussions Screen

**Route:** `Discussions` (tab 2)
**File:** [src/pages/discussions/ui/DiscussionsScreen.tsx](../../src/pages/discussions/ui/DiscussionsScreen.tsx)
**Design frame:** _Discussion Threads_ in `docs/designs/design-proposal.pen`

## Purpose

Community hub where users browse, search, and filter live book discussion threads. Users can start new threads, navigate to thread detail, and filter their own or community threads.

## Layout

```
┌─────────────────────────────┐
│  "Discussions"          [+] │  ← + navigates to CreateThread (modal)
├─────────────────────────────┤
│  🔍 Search discussions...   │  ← controlled TextInput, debounced via state
├─────────────────────────────┤
│  [All] [Popular] [Recent]   │
│  [My Threads]               │  ← FilterRow, onChange fires API refetch
├─────────────────────────────┤
│  Thread card                │  ← tappable → ThreadDetail
│  Thread card                │
│  Thread card                │
│  …                          │
│  — or —                     │
│  "No threads yet — …"       │  ← empty state
└─────────────────────────────┘
│  Pill tab bar               │
└─────────────────────────────┘
```

## User flow

1. Screen mounts → `useGetThreadsQuery({ filter: 'recent' })` fires; thread list renders.
2. **Search bar** — `TextInput` controls `search` state; a `useEffect` debounces it 300ms before it's passed to the query.
3. **Filter chips** — `FilterRow` calls `onChange` which maps the label to an API `filter` value (`all | popular | recent | mine`) and triggers a re-query. Initial active chip: `Recent`.
4. **Thread cards** — each card shows cover thumbnail (or placeholder), title, book context, preview text, reply count, like count, author avatar + name, and relative time. Tapping navigates to `ThreadDetail`.
5. **`+` button** — navigates to `CreateThread` (modal presentation).
6. **Empty state** — displayed when the query returns no results; message changes depending on whether a search term is active.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Thread card tap | `ThreadDetail` `{ threadId: string }` |
| `+` button | `CreateThread` (modal) |

## Key components used

| Component | Source |
|-----------|--------|
| `FilterRow` | `@features/filter-list/ui/FilterRow` |
| `ThreadCard` | `@entities/discussion/ui/ThreadCard` |

### `ThreadCard` typography note

The thread title inside `ThreadCard` uses `fontFamily.bold` (`Inter_700Bold`, 15 px) — matching the weight used for the same title in `ThreadDetailScreen` (`Inter_700Bold`, 17 px). The size intentionally differs (compact list vs full view), but the weight is consistent.

## API

```ts
useGetThreadsQuery({
  filter?: 'all' | 'popular' | 'recent' | 'mine',
  search?: string,   // sent only when ≥ 1 character after debounce
  page?: number,
  limit?: number,    // default 20
})
```

`popular` sorts by `likes DESC`, `recent` by `createdAt DESC`, `mine` scopes to the authenticated user's threads.

## Filters

```ts
filters={['All', 'Popular', 'Recent', 'My Threads']}
```

Label → API `filter` mapping:

| Label | API value |
|-------|-----------|
| All | `all` |
| Popular | `popular` |
| Recent | `recent` |
| My Threads | `mine` |
