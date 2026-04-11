# Progress Screen

**Route:** `Progress` (stack, no params)
**File:** [src/pages/progress/ui/ProgressScreen.tsx](../../src/pages/progress/ui/ProgressScreen.tsx)
**Design frame:** _Reading Stats & Level_ in `docs/designs/design-proposal.pen`

## Purpose

Dedicated screen for the user's reading journey — XP level, daily streak, aggregate stats, and recently earned badges. Reachable from any tab by tapping the avatar in the header.

## Layout

```
┌──────────────────────────────┐
│  ←  "My Progress"   ⚙ [👤]  │  ← ⚙ navigates to Settings
├──────────────────────────────┤
│  Level Card                  │
│  ┌──────────────────────────┐│
│  │  Lv.12  ████████░░  80% ││  ← purple XP card
│  └──────────────────────────┘│
├──────────────────────────────┤
│  Streak Card                 │
│  🔥 12-day streak            │
│  M  T  W  T  F  S  S        │  ← day dots
├──────────────────────────────┤
│  Stats Grid                  │
│  [Books read] [Pages]        │
│  [Hours]      [Avg/day]      │
├──────────────────────────────┤
│  Recent Badges    See all    │
│  🏅  🏅  🏅                  │
└──────────────────────────────┘
```

## User flow

1. Arrived via avatar tap from `Discover`, `Library`, or `Challenges`.
2. Reads `user` and `stats` from `userSlice` via `useSelector`.
3. **Settings icon** in the header → navigates to `Settings`.
4. **Back arrow** → `navigation.goBack()` returns to the previous tab screen.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Back button | Previous screen (any tab) |
| Settings icon (⚙) | `Settings` |

## Key components used

| Component | Source |
|-----------|--------|
| `LevelCard` | `@widgets/level-card` |
| `StreakCard` | `@widgets/streak-card` |
| `StatsGrid` | `@widgets/stats-grid` |
| `BadgesRow` | `@widgets/badges-row` |

## State

Reads `state.user.user` and `state.user.stats` from `userSlice`. See [feature docs](../../src/features/track-progress/README.md).
