# Challenges Screen

**Route:** `Compete` (tab 4)
**File:** [src/pages/challenges/ui/ChallengesScreen.tsx](../../src/pages/challenges/ui/ChallengesScreen.tsx)
**Design frame:** _Challenges & Competitions_ in `docs/designs/design-proposal.pen`

## Purpose

Gamified reading challenges and a community leaderboard. Data is fully live from the backend — challenges include the authenticated user's current progress; the leaderboard shows top participants for the first active challenge.

## Layout

```
┌──────────────────────────────┐
│  "Challenges"    [🏆] [avatar]│  ← avatar navigates to Progress
├──────────────────────────────┤
│  [Active] [Monthly] [Yearly] │
│  [Leaderboard]               │  ← FilterRow (UI only — does not yet filter the query)
├──────────────────────────────┤
│  Active Challenges  See all  │
│  ┌──────────────────────────┐│
│  │  April Reads     3/4     ││  ← blue monthly card with live progress bar
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │  Year of Books  12/24    ││  ← yearly card with live progress bar
│  └──────────────────────────┘│
├──────────────────────────────┤
│  Leaderboard      This Month │
│  🥇 row (gold highlight)     │  ← top participant in first challenge
│  🥈 row                      │
│  🥉 row                      │
│  …                           │
└──────────────────────────────┘
│  Pill tab bar                │
└──────────────────────────────┘
```

## User flow

1. `useGetChallengesQuery()` fires on mount; returns active challenges — those whose `activeFrom ≤ today ≤ activeTo` — with the authenticated user's `current` progress embedded.
2. `firstChallengeId` is derived from the first returned challenge.
3. `useGetChallengesByIdLeaderboardQuery({ id: firstChallengeId })` fetches top participants for that challenge (skipped while `firstChallengeId` is undefined).
4. **Filter chips** — `Active / Monthly / Yearly / Leaderboard` are rendered via `FilterRow`; they are visible but do not yet pass the filter to the query (future: wire `onChange` to re-query with `?filter=monthly` etc.).
5. **Challenge cards** — each card shows title, subtitle, badge text, and a `ProgressBar` driven by `current / target`. Monthly challenges use the blue (`$challenge-blue`) variant; yearly use the neutral card style.
6. **Trophy button** — opens the leaderboard or badges view (not yet implemented).
7. **Tap avatar** → navigates to `Progress`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Avatar press | `Progress` |
| Challenge card tap | _(not yet implemented)_ |

## Key components used

| Component | Source |
|-----------|--------|
| `FilterRow` | `@features/filter-list/ui/FilterRow` |
| `ChallengeCard` | `@entities/challenge/ui/ChallengeCard` |
| `LeaderboardSection` | `@widgets/leaderboard/ui/LeaderboardSection` |

## API

| Hook | Endpoint | Notes |
|------|----------|-------|
| `useGetChallengesQuery` | `GET /challenges` | Returns `Challenge[]` with embedded `current` progress |
| `useGetChallengesByIdLeaderboardQuery` | `GET /challenges/:id/leaderboard` | Returns `LeaderboardEntry[]` sorted by challenge progress |

## Challenge data shape

```ts
type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  current: number;   // authenticated user's progress
  target: number;
  badgeText: string; // e.g. "Champion"
  variant: 'monthly' | 'yearly';
};
```

`ChallengeCard` progress bar = `current / target`. When `current >= target` the bar is full and the badge is earned.
