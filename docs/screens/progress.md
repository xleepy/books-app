# Progress Screen

**Route:** `Progress` (stack, no params)
**File:** [src/pages/progress/ui/ProgressScreen.tsx](../../src/pages/progress/ui/ProgressScreen.tsx)
**Design frame:** _Reading Stats & Level_ in `docs/designs/design-proposal.pen`

## Purpose

Dedicated screen for the user's reading journey — XP level, daily streak, aggregate reading stats, and recently earned badges. All data is live from the backend. Reachable from any tab by tapping the avatar in the header.

## Layout

```
┌──────────────────────────────┐
│  ←  "My Progress"   ⚙ [👤]  │  ← ⚙ navigates to Settings
├──────────────────────────────┤
│  Level Card                  │
│  ┌──────────────────────────┐│
│  │  Lv.2  ████░░░░░░  40%  ││  ← purple XP card; progress from xpCurrentLevel/xpToNextLevel
│  │  Reader                  ││  ← level title from API
│  └──────────────────────────┘│
├──────────────────────────────┤
│  Streak Card                 │
│  🔥 3-day streak             │
│  M  T  W  T  F  S  S        │  ← weekDays[] from API
├──────────────────────────────┤
│  Stats Grid                  │
│  [Pages Read]  [Books Done]  │
│  [Avg/day]     [Hrs Read]    │
├──────────────────────────────┤
│  Recent Badges    See all    │
│  🔖  🔥  ⭐                  │  ← live from GET /me/badges; slug → Lucide icon mapping
│  — or —                      │
│  "No badges earned yet…"     │  ← empty state for new users
└──────────────────────────────┘
```

## User flow

1. Arrived via avatar tap from `Discover`, `Library`, or `Challenges`.
2. `useGetMeQuery` is called globally in `RootNavigator`; result seeds `userSlice` via `extraReducers`. Screen reads `user` and `stats` from `useSelector`.
3. `useGetMeBadgesQuery` fires on mount; `BadgesRow` renders live badges with slug-based icon mapping.
4. **Settings icon** → navigates to `Settings`.
5. **Back arrow** → `navigation.goBack()`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Back button | Previous screen |
| Settings icon (⚙) | `Settings` |

## Key components used

| Component | Source |
|-----------|--------|
| `LevelCard` | `@widgets/level-card` |
| `StreakCard` | `@widgets/streak-card` |
| `StatsGrid` | `@widgets/stats-grid` |
| `BadgesRow` | `@widgets/badges-row` |

## State & API

| Source | Data |
|--------|------|
| `userSlice` (via `meApi.getMe`) | `user.level`, `user.levelTitle`, `user.xpCurrent`, `user.xpRequired`, `user.avatarHue` |
| `userSlice` (via `meApi.getMe`) | `stats.streak`, `stats.bestStreak`, `stats.weekDays`, `stats.booksFinished`, `stats.pagesRead`, `stats.hoursRead` |
| `useGetMeBadgesQuery` | `badges[].slug`, `badges[].name`, `badges[].awardedAt` |

### Badge slug → icon mapping

| Slug | Icon (Lucide) |
|------|---------------|
| `first-chapter` | `BookOpen` |
| `on-fire` | `Flame` |
| `critic` | `Star` |
| `centurion` | `Trophy` |
| `champion` | `ShieldCheck` |
| _(unknown)_ | `Award` (fallback) |

### Level progression

XP thresholds use `xp_per_level(n) = 150n − 50`. The server returns `xpCurrentLevel` (XP earned within the current level) and `xpToNextLevel` (XP needed to advance). `LevelCard` computes the progress bar ratio as `xpCurrentLevel / xpToNextLevel`.
