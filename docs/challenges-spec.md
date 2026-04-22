# User-Created Challenges — Frontend Specification

> Status: Draft | Target: MVP
> Pattern: Spec-Driven Development (SDD) — UI/API contract defined before implementation.

---

## 1. Overview

Enable users to **create** their own reading challenges via templates, **view** challenge details with a leaderboard, and **join/leave** challenges. This replaces the current hardcoded-only challenge system.

---

## 2. API Contract (Backend → Frontend)

The frontend relies on the following API surface. See `backend-spec.md` for full implementation details.

### 2.1 New Endpoints

| Method | Route | Request | Response |
|---|---|---|---|
| `POST` | `/challenges` | `{ title, description, variant, metric, target, activeFrom, activeTo, badgeId }` | `Challenge` |
| `GET` | `/challenges/:id` | — | `ChallengeDetail` |
| `DELETE` | `/challenges/:id` | — | `204` |
| `POST` | `/challenges/:id/join` | — | `UserChallenge` |
| `POST` | `/challenges/:id/leave` | — | `204` |

### 2.2 Updated Endpoints

| Method | Route | Change |
|---|---|---|
| `GET` | `/challenges` | Returns both system and user-created `public` challenges. Filter supports `variant` values: `monthly`, `yearly`, `weekly`, `custom`. |
| `GET` | `/challenges/:id/leaderboard` | No schema change. |

### 2.3 New/Updated Types

```typescript
// Challenge (existing, extended)
type Challenge = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;        // NEW
  goal?: string;
  variant: string;             // monthly | yearly | weekly | custom
  metric: string;              // NEW: books | pages | hours | streak
  target: number;
  creatorId?: string;          // NEW
  creatorName?: string;        // NEW
  participantCount: number;    // NEW
  badgeId?: string;
  badgeText?: string;          // NEW (computed)
  activeFrom?: string;         // ISO date
  activeTo?: string;           // ISO date
  current?: number;            // user's progress (included when joined)
  isJoined?: boolean;          // NEW
  isCreator?: boolean;         // NEW
};

// ChallengeDetail (NEW)
type ChallengeDetail = Challenge & {
  leaderboard: LeaderboardEntry[];
};

// CreateChallengePayload (NEW)
type CreateChallengePayload = {
  title: string;
  description?: string;
  variant: string;
  metric: string;
  target: number;
  activeFrom?: string;
  activeTo?: string;
  badgeId?: string;
};

// UserChallenge (existing, no schema change)
type UserChallenge = {
  challengeId: string;
  current: number;
  completed: boolean;
  completedAt?: string;
};
```

---

## 3. State Management (Redux + RTK Query)

### 3.1 New RTK Query Endpoints

Extend `challengesApi.generated.ts` with:

```typescript
// Queries
getChallengeById: build.query<{ data: ChallengeDetail }, { id: string }>

// Mutations
createChallenge: build.mutation<{ data: Challenge }, CreateChallengePayload>
joinChallenge: build.mutation<void, { id: string }>
leaveChallenge: build.mutation<void, { id: string }>
```

### 3.2 Cache Invalidation

| Mutation | Invalidates |
|---|---|
| `createChallenge` | `getChallenges` |
| `joinChallenge` | `getChallenges`, `getChallengeById` |
| `leaveChallenge` | `getChallenges`, `getChallengeById` |

> Rule: Mutations must use `.unwrap()` with `try/catch` for error handling (per REDUX_GUIDE).

---

## 4. Navigation Changes

Add to the **Challenges Stack Navigator**:

```
ChallengesScreen (existing)
  └─> ChallengeDetailScreen (NEW)
      └─> LeaderboardScreen (existing, or inline)
  └─> CreateChallengeScreen (NEW — modal presentation preferred)
```

### 4.1 Screen Transitions

- **ChallengeDetail**: Push (right-to-left), standard stack transition
- **CreateChallenge**: Modal (bottom-to-top), with `presentation: 'modal'` in React Navigation

---

## 5. UI/UX Specification

### 5.1 Challenges List Screen (Updates)

**Header changes:**
- Add **"+" button** (plus icon) to the right of the trophy button
- Tap → navigate to `CreateChallengeScreen`

**Challenge Card changes:**
- Entire card is **tappable** → navigate to `ChallengeDetailScreen`
- Subtitle shows variant + metric: `"Monthly Sprint • Books"`
- If `isCreator`, show small "Created by you" badge
- Show participant count in bottom-right (e.g., "1,247 participants")

### 5.2 Challenge Detail Screen (NEW)

**Layout (vertical scroll):**

```
┌─────────────────────────────┐
│ ←  Challenge Details   [share] │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [icon] Title            │ │  ← Hero Card (variant-colored)
│ │ Variant • Metric        │ │
│ │ Description...          │ │
│ │ Creator | Participants  │ │
│ │            | Ends       │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Your Progress               │
│ ████████████░░░░  3 / 5     │
│ Started Apr 1  | 60% done   │
├─────────────────────────────┤
│ Leaderboard          Top 50 │
│ 🥇 Sarah M.     9 books     │
│ 🥈 Alex K.      7 books     │
│ 🥉 You          5 books     │
│ ...                         │
├─────────────────────────────┤
│ [ Join Challenge ]          │  ← Sticky bottom CTA
└─────────────────────────────┘
```

**States:**

| State | CTA | Actions |
|---|---|---|
| Not joined | "Join Challenge" | `POST /challenges/:id/join` |
| Joined | "Leave Challenge" | `POST /challenges/:id/leave` |
| Creator | "Cancel Challenge" | `DELETE /challenges/:id` + confirm dialog |
| Completed | "Completed ✓" (disabled) | — |

**Behavior:**
- Progress bar color matches challenge variant theme
- Leaderboard shows top 10; tap "See All" → full leaderboard screen (reuse existing)
- Share button copies deep link to clipboard

### 5.3 Create Challenge Screen (NEW)

**Presentation:** Full-screen modal with its own nav header (X / back + "Create Challenge" title).

**Layout (vertical scroll):**

```
┌─────────────────────────────┐
│ ←  Create Challenge         │
├─────────────────────────────┤
│ Choose a Template           │
│ [Monthly] [Yearly] [Streak] │  ← Horizontal scroll
│ [Pages]   [Custom]          │
├─────────────────────────────┤
│ Challenge Title             │
│ [_______________________]   │
│ Description                 │
│ [_______________________]   │
├─────────────────────────────┤
│ Goal Metric                 │
│ [Books] [Pages] [Hours][Strk]│ ← Pill toggle
├─────────────────────────────┤
│ Target                      │
│ [__________]  [▲] [▼]       │ ← Number stepper
├─────────────────────────────┤
│ Duration                    │
│ [Start Date]  [End Date]    │
├─────────────────────────────┤
│ Select Badge (optional)     │
│ [🏅] [📚] [🔥] [...]        │ ← Horizontal scroll of system badges
├─────────────────────────────┤
│ [ Create Challenge ]        │  ← Sticky bottom CTA
└─────────────────────────────┘
```

**Template behavior:**

| Template | Pre-fills |
|---|---|
| Monthly Sprint | variant=`monthly`, metric=`books`, activeFrom=today, activeTo=end of month |
| Yearly Goal | variant=`yearly`, metric=`books`, activeFrom=today, activeTo=end of year |
| Weekly Blitz | variant=`weekly`, metric=`books`, activeFrom=today, activeTo=+7 days |
| Streak Keeper | variant=`custom`, metric=`streak`, target=7, activeFrom=today, activeTo=+30 days |
| Pages Marathon | variant=`custom`, metric=`pages`, target=1000, activeFrom=today, activeTo=+30 days |
| Custom | Nothing pre-filled; user sets all fields |

**Validation:**
- Title: required, max 80 chars
- Target: required, min 1, max 9999
- activeFrom: required, must be ≥ today
- activeTo: required, must be > activeFrom

**Error handling:**
- Show inline errors below fields
- Disable "Create" until form is valid
- On API error, show Toast with error message

---

## 6. Component Breakdown (FSD)

### New Components

| Component | Layer | Location |
|---|---|---|
| `ChallengeDetailScreen` | pages | `src/pages/challenge-detail/ui/` |
| `CreateChallengeScreen` | pages | `src/pages/create-challenge/ui/` |
| `ChallengeHeroCard` | widgets | `src/widgets/challenge-hero/ui/` |
| `ChallengeProgressCard` | widgets | `src/widgets/challenge-progress/ui/` |
| `JoinChallengeButton` | features | `src/features/join-challenge/ui/` |
| `CreateChallengeForm` | features | `src/features/create-challenge/ui/` |
| `TemplatePicker` | features | `src/features/create-challenge/ui/` |
| `MetricPicker` | features | `src/features/create-challenge/ui/` |
| `BadgePicker` | features | `src/features/create-challenge/ui/` |

### Updated Components

| Component | Change |
|---|---|
| `ChallengesScreen` | Add "+" header button, make cards tappable |
| `ChallengeCard` | Add participant count, creator badge, tap handler |

---

## 7. Open Questions

| # | Question | Resolution |
|---|---|---|
| 1 | Deep link format for sharing challenges? | TBD: `booksapp://challenges/:id` or universal link |
| 2 | Should creator auto-join their challenge? | Yes — backend handles on creation |
| 3 | Can users edit a challenge after creation? | MVP: No. Delete + recreate. |
| 4 | Real-time leaderboard updates? | MVP: Pull-to-refresh only. |

---

## 8. Acceptance Criteria

- [ ] User sees "+" button on Challenges list and can open Create screen
- [ ] User can pick a template and see fields pre-filled
- [ ] User can fill all required fields and create a challenge
- [ ] Created challenge appears immediately in the list
- [ ] Tapping any challenge opens Detail screen with correct data
- [ ] Join/Leave buttons work and update UI optimistically
- [ ] Creator sees "Cancel Challenge" and can delete it
- [ ] Leaderboard displays on detail screen
- [ ] All new API calls use `.unwrap()` with error handling
- [ ] TypeScript `typecheck` passes with no errors

---

## 9. Related Files

| File | Purpose |
|---|---|
| `backend-spec.md` | Backend API and schema specification |
| `docs/designs/design-proposal.pen` | Pencil designs for Detail + Create screens |
| `src/shared/api/challengesApi.generated.ts` | Generated RTK Query API (regenerate after backend) |
| `src/entities/challenge/model/types.ts` | Challenge domain types |

---

*Generated following Spec-Driven Development pattern: API contract → Types → UI Spec → Component breakdown → Implementation.*
