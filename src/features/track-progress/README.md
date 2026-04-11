# track-progress

Holds the user's profile, reading statistics, and currently-reading book. Drives the **Reading Stats & Level** and **My Library** screens.

## Design

Data from this feature populates two screens in `docs/designs/design-proposal.pen`:

| Screen | Elements fed by this feature |
|--------|------------------------------|
| **Reading Stats & Level** | Level card (XP / level badge), streak tracker, stats grid, recent badges |
| **My Library** | Stats row (books read, pages, streak), currently-reading card with progress bar, saved-books grid |

## State — `userSlice`

**File:** [model/userSlice.ts](model/userSlice.ts)

### Shape

```ts
interface UserState {
  user: User;               // profile (name, avatar, level, …)
  stats: ReadingStats;      // aggregate reading statistics
  currentBook: {
    title: string;
    author: string;
    progress: number;       // 0–1 (e.g. 0.68 = 68 %)
    timeLeft: string;       // human-readable estimate, e.g. "4h left"
  };
}
```

`User` and `ReadingStats` types are defined in `@entities/user/model/types`. Mock data is sourced from `@entities/user/mock/user`.

### Actions

No write actions are defined yet — the slice currently exposes read-only state seeded from mock data. Mutations (updating progress, logging a session, etc.) are expected to be added as the feature grows.

### Selector access

Import `userReducer` and mount it at the `user` key in the Redux store. Access state via standard `useSelector` hooks in consuming screens.
