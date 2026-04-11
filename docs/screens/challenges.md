# Challenges Screen

**Route:** `Compete` (tab 4)
**File:** [src/pages/challenges/ui/ChallengesScreen.tsx](../../src/pages/challenges/ui/ChallengesScreen.tsx)
**Design frame:** _Challenges & Competitions_ in `docs/designs/design-proposal.pen`

## Purpose

Gamified reading challenges and a leaderboard. Users can track their active reading challenges and compare progress with the community.

## Layout

```
┌──────────────────────────────┐
│  "Challenges"    [🏆] [avatar]│  ← avatar navigates to Progress
├──────────────────────────────┤
│  [Active] [Monthly] [Yearly] │
│  [Leaderboard]               │  ← FilterRow (horizontal scroll)
├──────────────────────────────┤
│  Active Challenges  See all  │
│  ┌──────────────────────────┐│
│  │  Monthly Challenge card  ││  ← blue accent card
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │  Yearly Challenge card   ││  ← neutral card
│  └──────────────────────────┘│
├──────────────────────────────┤
│  Leaderboard                 │
│  🥇 row (gold highlight)     │
│  🥈 row                      │
│  🥉 row                      │
└──────────────────────────────┘
│  Pill tab bar                │
└──────────────────────────────┘
```

## User flow

1. Screen loads active challenges from `mockChallenges` and leaderboard entries from `mockLeaderboard`.
2. **Filter chips** — `Active / Monthly / Yearly / Leaderboard`; active chip is highlighted with accent fill. Managed locally by `FilterRow` (no server-side filtering yet — all data is always rendered).
3. **Challenge cards** — each card shows challenge name, description, and progress. Tapping would open a challenge detail view (not yet implemented).
4. **Trophy button** — intended shortcut to the leaderboard or badges view (not yet implemented).
5. **Leaderboard section** — top-ranked users; first-place row has a gold highlight border.
6. **Tap avatar** → navigates to `Progress`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Avatar press | `Progress` |
| Challenge card tap | Challenge detail (not yet implemented) |

## Key components used

| Component | Source |
|-----------|--------|
| `FilterRow` | `@features/filter-list/ui/FilterRow` |
| `ChallengeCard` | `@entities/challenge/ui/ChallengeCard` |
| `LeaderboardSection` | `@widgets/leaderboard/ui/LeaderboardSection` |

## Filters

```ts
filters={['Active', 'Monthly', 'Yearly', 'Leaderboard']}
```

Initial active filter: `'Active'`. See [feature docs](../../src/features/filter-list/README.md).
