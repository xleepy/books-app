# Discussions Screen

**Route:** `Discussions` (tab 2)
**File:** [src/pages/discussions/ui/DiscussionsScreen.tsx](../../src/pages/discussions/ui/DiscussionsScreen.tsx)
**Design frame:** _Discussion Threads_ in `docs/designs/design-proposal.pen`

## Purpose

Community hub where users browse, search, and filter book discussion threads. Users can also start new threads.

## Layout

```
┌─────────────────────────────┐
│  "Discussions"          [+] │  ← + button starts a new thread
├─────────────────────────────┤
│  🔍 Search discussions...   │
├─────────────────────────────┤
│  [All] [Popular] [Recent]   │
│  [My Threads]               │  ← FilterRow (horizontal scroll)
├─────────────────────────────┤
│  Thread card                │
│  Thread card                │
│  Thread card                │
│  …                          │
└─────────────────────────────┘
│  Pill tab bar               │
└─────────────────────────────┘
```

The full content area is inside a scrollable `Screen` component.

## User flow

1. Screen loads with all threads from `mockThreads`.
2. **Search bar** — free-text input to filter threads by keyword (UI only, no filtering logic yet).
3. **Filter chips** — one of `All / Popular / Recent / My Threads` is active at a time; managed by `FilterRow` internally.
4. **Thread cards** — tapping a card would navigate to a thread detail view (not yet implemented).
5. **`+` button** — intended entry point for creating a new thread (not yet implemented).

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Thread card tap | Thread detail (not yet implemented) |
| `+` button | New thread flow (not yet implemented) |

## Key components used

| Component | Source |
|-----------|--------|
| `FilterRow` | `@features/filter-list/ui/FilterRow` |
| `ThreadCard` | `@entities/discussion/ui/ThreadCard` |

## Filters

```ts
filters={['All', 'Popular', 'Recent', 'My Threads']}
```

Initial active filter: `'All'` (default first item). See [feature docs](../../src/features/filter-list/README.md).
