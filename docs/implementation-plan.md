# Books App — Implementation Plan

**Status:** Phases 1–13 complete. Backend Phases 5–6 live; all screens driven by real API.
**Last updated:** 2026-04-22

> React Native mobile app built from `design-proposal.pen`, using Expo, TypeScript, Redux Toolkit, and Feature-Sliced Design architecture.

## Tech Stack

| Category   | Choice                                                      | Version |
| ---------- | ----------------------------------------------------------- | ------- |
| Framework  | React Native (Expo managed workflow, SDK 54)                | 0.81.5  |
| Language   | TypeScript (strict mode)                                    | 6.0.2   |
| React      | React                                                       | 19.2.5  |
| Navigation | React Navigation (bottom tabs + native stack)               | 6.x     |
| State      | Redux Toolkit + RTK Query                                   | 2.11.2  |
| Animations | react-native-reanimated v4 + react-native-gesture-handler   | 4.1.7   |
| Worklets   | react-native-worklets (required peer dep for reanimated v4) | 0.5.1   |
| Icons      | lucide-react-native                                         | 1.8.0   |
| Typography | @expo-google-fonts/inter                                    | 0.2.3   |
| Auth       | @supabase/supabase-js + expo-secure-store                   | 2.x     |

### Package pinning

All `package.json` versions are **exact** (no `^` or `~`). TypeScript 6.x and React 19.2.x are intentionally newer than Expo SDK 54's recommended versions; they are excluded from `expo install --fix` validation via `"expo.install.exclude"` in `package.json`.

## Screens

| #   | Screen                    | Tab / Route       | Description                                                           |
| --- | ------------------------- | ----------------- | --------------------------------------------------------------------- |
| 1   | Discover - Swipe          | `Discover` (tab)  | Swipeable book cards with pass/bookmark/like actions                  |
| 2   | Book Detail - Reviews     | `BookDetail`      | Cover, metadata, synopsis, reviews, library CTA                       |
| 3   | Discussion Threads        | `Discussions`     | Live thread list with search, filter chips, create thread             |
| 4   | Thread Detail             | `ThreadDetail`    | Full thread body, replies, like toggle, reply input, delete (owner)   |
| 5   | Create Thread             | `CreateThread`    | Modal form: title, body, optional book link, spoiler toggle           |
| 6   | My Library                | `Library` (tab)   | Stats tiles, currently reading card, saved books grid                 |
| 6a  | Reading Detail            | `ReadingDetail`   | Page-level progress editor: direct page input + quick chips           |
| 7   | Reading Stats & Level     | `Progress`        | XP level card, streak tracker, 2×2 stats, live badges from API        |
| 8   | Challenges & Competitions | `Compete` (tab)   | Active challenges (month/year), live leaderboard                      |
| 9   | Settings                  | `Settings`        | Profile card, reading/notification/privacy preferences, Sign Out      |

## Bottom Tab Bar

Custom pill-shaped tab bar (cornerRadius 36, 62px height, 4px inner padding).

| Tab         | Icon (Lucide)  | Active Style               |
| ----------- | -------------- | -------------------------- |
| DISCOVER    | compass        | `$accent` fill, white text |
| DISCUSSIONS | message-circle | `$accent` fill, white text |
| LIBRARY     | book-open      | `$accent` fill, white text |
| COMPETE     | trophy         | `$accent` fill, white text |

Inactive tabs use `$tab-inactive` color. Cannot be achieved with default React Navigation tab bar styling — requires custom `tabBar` prop.

## Design Tokens

From `design-proposal.pen` variables:

| Token                   | Value     | Usage                                          |
| ----------------------- | --------- | ---------------------------------------------- |
| `$accent`               | `#C45A3C` | Primary action color, active tabs, CTA buttons |
| `$accent-light`         | `#F0D9C8` | Tag backgrounds, spoiler pills                 |
| `$accent-green`         | `#4A7C59` | Success indicators                             |
| `$accent-red`           | `#C44B4B` | Error/destructive, like hearts, delete button  |
| `$bg-primary`           | `#FDFAF6` | Screen backgrounds                             |
| `$bg-secondary`         | `#F5EDE3` | Search bars, stat cards, input fields          |
| `$bg-card`              | `#FFFFFF` | Card surfaces                                  |
| `$bg-dark`              | `#1A1614` | Dark mode (future)                             |
| `$font-primary`         | `#1A1614` | Headings, body text                            |
| `$font-secondary`       | `#7A7068` | Subtitles, descriptions                        |
| `$font-tertiary`        | `#A89E95` | Placeholders, timestamps, counts               |
| `$font-inverse`         | `#FFFFFF` | Text on accent backgrounds                     |
| `$border`               | `#E8DFD4` | Card/tab borders                               |
| `$border-light`         | `#F0EAE2` | Subtle dividers                                |
| `$star-gold`            | `#E8A838` | Star ratings, bookmark icon                    |
| `$tab-inactive`         | `#B8AFA6` | Inactive tab icons/labels                      |
| `$badge-gold`           | `#D4A332` | Badge icons, leaderboard 1st place border      |
| `$badge-gold-light`     | `#FDF3DB` | Badge circle backgrounds                       |
| `$challenge-blue`       | `#4A82B8` | Monthly challenge card                         |
| `$challenge-blue-light` | `#E3EEF7` | Challenge accent                               |
| `$streak-orange`        | `#E8823A` | Streak flame                                   |
| `$streak-orange-light`  | `#FEF0E4` | Streak bg                                      |
| `$xp-purple`            | `#7C5CBF` | Level card bg                                  |
| `$xp-purple-light`      | `#EDE7F6` | Level badge circle                             |

Typography: Inter font family, sizes 10–40px, weights 400/500/600/700, lineHeight 1.5 for body text, letterSpacing 0.5 for tab labels.

## Project Structure (Feature-Sliced Design)

6 layers (pragmatic FSD — no `processes` layer). Imports flow strictly downward: `app → pages → widgets → features → entities → shared`.

```
src/
  app/                                # Layer 1: App-wide wiring
    providers/
      StoreProvider.tsx               # Redux <Provider>
      NavigationProvider.tsx          # NavigationContainer
    navigation/
      RootNavigator.tsx               # Stack: Tabs + BookDetail + Progress + Settings
                                      #        + ThreadDetail + CreateThread (modal)
      TabNavigator.tsx                # 4 bottom tabs with custom PillTabBar
      types.ts                        # RootStackParamList + TabParamList
    index.tsx                         # App entry — loads fonts, composes providers

  shared/                             # Layer 2: Reusable non-business code
    ui/
      Tag.tsx                         # Pill chip — $accent-light bg, $accent text
      StarRating.tsx                  # Row of 5 star icons, configurable value
      Avatar.tsx                      # Initials-based circular avatar with HSL hue
      Separator.tsx                   # 1px $border-light horizontal rule
      PillTabBar.tsx                  # Custom pill tab bar component
      FilterChip.tsx                  # Active/inactive filter pill
      ActionButton.tsx                # Circular action button (configurable size/color)
      ProgressBar.tsx                 # Filled track bar (used in ReadingCard, LevelCard)
      index.ts                        # Re-exports all shared UI
    theme/
      colors.ts                       # All 24 design tokens exported as constants
      typography.ts                   # Inter font variants + preset styles
      spacing.ts                      # Scale: 4, 8, 12, 14, 16, 20, 24, 32 + radii
      index.ts                        # Re-exports colors, fontFamily, spacing, radii
    lib/
      supabase.ts                     # Supabase client with SecureStore session persistence

  entities/                           # Layer 3: Business entities (types + dumb UI + mock data)
    book/
      model/types.ts                  # Book interface (mirrors booksApi types)
      ui/BookCover.tsx                # Image with cornerRadius + shadow + placeholder
      ui/BookMeta.tsx                 # Title + author + tags row
      mock/books.ts                   # Fallback mock data
    user/
      model/types.ts                  # User, ReadingStats interfaces
      mock/user.ts                    # Fallback mock data (used until API seeds)
    discussion/
      model/types.ts                  # Re-exports Thread, ThreadDetail, ThreadReply from API slice
      ui/ThreadCard.tsx               # Cover thumbnail + title + preview + stats + author + timestamp
      mock/discussions.ts             # Fallback mock threads
    challenge/
      model/types.ts                  # Re-exports Challenge, LeaderboardEntry from API slice
      ui/ChallengeCard.tsx            # Colored challenge card (monthly/yearly variants)
      ui/LeaderboardRow.tsx           # Rank + avatar + name + level + book count
    review/
      model/types.ts                  # Review interface
      ui/ReviewCard.tsx               # Reviewer info + stars + text
      mock/reviews.ts                 # Fallback mock reviews

  features/                           # Layer 4: User interactions (slices + interactive UI)
    auth/
      model/authSlice.ts              # session, isLoading — seeded from supabase.auth.getSession()
      ui/ (LoginScreen lives in pages)
    swipe-book/
      ui/SwipeableCard.tsx            # GestureDetector + useAnimatedStyle (rotate/translate/opacity)
      ui/SwipeActions.tsx             # Pass / Bookmark / Like buttons
      model/swipeSlice.ts             # currentIndex, nextCard(), resetDeck()
    add-to-library/
      ui/AddToLibraryButton.tsx       # $accent CTA
    filter-list/
      ui/FilterRow.tsx                # Horizontal scrollable filter chips; onChange callback
    track-progress/
      model/userSlice.ts              # user + stats hydrated from meApi.getMe via extraReducers
    user-avatar/
      index.ts                        # UserAvatar component (reads from userSlice)

  widgets/                            # Layer 5: Composite blocks
    book-swipe-stack/
      ui/BookSwipeStack.tsx           # Stacked SwipeableCards + SwipeActions
    review-section/
      ui/ReviewSection.tsx            # Reviews header + summary + ReviewCard list
    reading-card/
      ui/ReadingCard.tsx              # Currently-reading card with progress bar
    streak-card/
      ui/StreakCard.tsx               # 7-day dot row with flame icon
    level-card/
      ui/LevelCard.tsx                # $xp-purple card; uses xpCurrent/xpRequired from userSlice
    stats-grid/
      ui/StatsGrid.tsx                # 2×2 stats boxes (pagesRead, booksFinished, hoursRead, avg)
    badges-row/
      ui/BadgesRow.tsx                # Live badges from useGetMeBadgesQuery; empty + loading states
    leaderboard/
      ui/LeaderboardSection.tsx       # Header + LeaderboardRow items

  pages/                              # Layer 6: Full screen composites
    _shared/
      Screen.tsx                      # SafeArea wrapper with optional ScrollView + padding
      ScreenHeader.tsx                # Title + subtitle + right action + UserAvatar
    auth/
      ui/LoginScreen.tsx              # Email/password + Google OAuth (PKCE)
    discover/ui/DiscoverScreen.tsx
    book-detail/ui/BookDetailScreen.tsx
    discussions/
      ui/DiscussionsScreen.tsx        # Live thread list — filter/search wire to GET /threads
      ui/ThreadDetailScreen.tsx       # Thread body + replies + like toggle + reply input
                                      # Delete button (owner only, with confirmation Alert)
      ui/CreateThreadScreen.tsx       # Modal: title + body + book picker + spoiler toggle
    library/
      ui/LibraryScreen.tsx
      ui/LibraryListScreen.tsx        # Full list with All/Reading/Saved/Finished tabs
    reading-detail/
      ui/ReadingDetailScreen.tsx      # Data loader: waits for book + library data
      ui/ReadingProgressForm.tsx      # Pure form: page input, chips, submit
    progress/ui/ProgressScreen.tsx
    challenges/ui/ChallengesScreen.tsx
    settings/ui/SettingsScreen.tsx

  store/                              # Redux store config
    store.ts                          # configureStore — auth + swipe + user + RTK Query
    api/
      apiSlice.ts                     # fetchBaseQuery; prepareHeaders injects access_token
      booksApi.generated.ts           # useGetBooksQuery, useGetBooksByIdQuery, feed query
      libraryApi.generated.ts         # useGetLibraryQuery, usePostLibrary…, usePatch…, useDelete…
      meApi.generated.ts              # useGetMeQuery, useGetMeBadgesQuery
      reviewsApi.generated.ts         # useGetBooksByIdReviewsQuery, usePostBooksByIdReviews…
      discussionsApi.generated.ts     # useGetThreadsQuery, useGetThreadsByIdQuery,
                                      # usePostThreadsMutation, usePostThreadsByIdRepliesMutation,
                                      # usePostThreadsByIdLikeMutation, useDeleteThreadsByIdMutation
      challengesApi.generated.ts      # useGetChallengesQuery, useGetChallengesByIdLeaderboardQuery
      swipesApi.generated.ts          # usePostSwipesMutation
      authApi.generated.ts            # usePostAuthLogoutMutation
```

## Implementation Phases

### Phase 1 — Project Bootstrap & Design System ✅

1. Scaffold project manually in existing directory (skip `create-expo-app` — dir not empty)
2. Install all dependencies (exact pinned versions)
3. `babel.config.js` — preset: `babel-preset-expo`, plugin: `react-native-worklets/plugin`
4. `tsconfig.json` — strict mode, no `baseUrl`, paths prefixed with `./`
5. `index.ts` — registers app, imports `react-native-gesture-handler` first
6. Create design tokens in `src/shared/theme/`
7. Map book cover PNGs in `src/shared/assets/images/index.ts`
8. Create all mock data files under `src/entities/*/mock/`

### Phase 2 — Navigation Structure ✅

1. `src/app/navigation/types.ts` — `RootStackParamList` and `TabParamList`
2. `src/app/navigation/TabNavigator.tsx` — custom `tabBar` rendering PillTabBar; 4 tabs
3. `src/app/navigation/RootNavigator.tsx` — native stack wrapping TabNavigator; BookDetail and Progress as stack screens

### Phase 3 — Shared UI Components ✅

Tag, StarRating, Avatar, Separator, PillTabBar, FilterChip, ActionButton, ProgressBar.

### Phase 4 — Entities (Dumb UI) ✅

BookCover, BookMeta, ReviewCard, ThreadCard, ChallengeCard, LeaderboardRow.

### Phase 5 — Features (Interactive) ✅

SwipeableCard, SwipeActions, swipeSlice, AddToLibraryButton, FilterRow, userSlice.

### Phase 6 — Widgets (Composite Blocks) ✅

BookSwipeStack, ReviewSection, ReadingCard, StreakCard, LevelCard, StatsGrid, BadgesRow, LeaderboardSection.

### Phase 7 — Pages (Screens) ✅

DiscoverScreen, BookDetailScreen, DiscussionsScreen, LibraryScreen, ProgressScreen, ChallengesScreen.

### Phase 8 — Redux Store & Wiring ✅

Store, RTK Query shell, all slices wired to screens.

### Phase 9 — Polish ✅

Safe area insets, ScrollView screens, Lucide icon names verified, `expo.install.exclude`.

### Phase 10 — API Integration ✅ (2026-04-19)

RTK Query code-generated hooks replace all mock data. MSW available in dev via `EXPO_PUBLIC_MOCK_API=true`.

- ✅ `fetchBaseQuery` with `prepareHeaders` injecting `auth.session.access_token`
- ✅ All generated API hook files: `booksApi`, `libraryApi`, `meApi`, `reviewsApi`, `discussionsApi`, `challengesApi`, `swipesApi`
- ✅ `BookSwipeStack` — `useGetBooksFeedQuery`, `usePostSwipesMutation`, `usePostLibraryByBookIdMutation`
- ✅ `LibraryScreen` / `LibraryListScreen` — full list with status filters; book tile navigation
- ✅ `BookDetailScreen` — `useGetBooksByIdQuery`, library PATCH/DELETE actions; opens from library with actions, from Discover with Add CTA
- ✅ `userSlice` — `extraReducers` populates from `meApi.getMe.matchFulfilled`

### Phase 11 — Auth ✅ (2026-04-19)

- ✅ Supabase client with SecureStore session persistence
- ✅ `authSlice` — Redux session state
- ✅ `LoginScreen` — email/password + Google OAuth (PKCE) + Apple Sign-In (iOS only)
- ✅ `RootNavigator` auth gate; `onAuthStateChange` subscription
- ✅ Settings → Sign Out
- ⏳ **Blocked on Supabase credentials** in `.env` before live auth works

### Phase 12 — Gamification + Discussions live ✅ (2026-04-21)

Depends on backend Phases 5 (gamification) and 6 (community threads) — both complete.

### Phase 13 — Reading Progress Detail ✅ (2026-04-22)

**New screen + backend field for page-level reading progress.**

- ✅ `ReadingDetailScreen` — new stack screen (`ReadingDetail: { bookId }`) reached by tapping the `ReadingCard` on `Library`
- ✅ `ReadingProgressForm` — pure form component separated from data loading; manages local page state with `useState`
- ✅ Direct page number input — tap large page number → numeric keyboard; no `-/+` stepper
- ✅ Quick chips — `+10`, `+25`, and `Finished` for one-tap updates
- ✅ `useGetLibraryQuery` pre-fills `initialPage` from server; `key={bookId}` resets form when switching books
- ✅ `usePatchLibraryByBookIdMutation` sends `{ currentPage, progressPct, status, isCurrent }`
- ✅ Button text adapts: "Update Progress" or "Mark as Finished" when `currentPage >= pageCount`
- ✅ Design frame added to `design-proposal.pen`: _Current Reading_

**Backend changes (see backend implementation plan):**
- `LibraryItem.currentPage` field added to Prisma schema + migration
- `PATCH /library/:bookId` derives `progressPct` from `currentPage / book.pageCount`
- `LibraryBook` response now includes `currentPage` and `pageCount`
- Frontend API regenerated via `npm run codegen`

**Gamification (backend Phase 5 live):**
- ✅ `ChallengesScreen` — `useGetChallengesQuery` drives live challenge cards; `useGetChallengesByIdLeaderboardQuery` drives leaderboard; both previously stubbed
- ✅ `ProgressScreen` — `useGetMeBadgesQuery` drives live `BadgesRow`; badge slug → Lucide icon mapping; loading + empty states
- ✅ `userSlice` — uses server-provided `xpCurrentLevel`/`xpToNextLevel` directly; `LevelCard` XP progress bar is accurate
- ✅ XP/streak/badges/challenge progress updated server-side when a book is finished or review is written

**Discussions (backend Phase 6 live):**
- ✅ `DiscussionsScreen` — `useGetThreadsQuery` with live `filter` and `search` params; previously used mock data
- ✅ `ThreadCard` — `onPress` navigates to `ThreadDetail`; author avatar + name shown; nullable `coverUrl`
- ✅ `ThreadDetailScreen` — `useGetThreadsByIdQuery`; like toggle (optimistic); reply input with `KeyboardAvoidingView`; delete button visible only to thread owner (with `Alert.alert` confirmation)
- ✅ `CreateThreadScreen` — modal with title, body, **book picker** (debounced `GET /books?q=` search, inline results list, selected book card), spoiler toggle; `usePostThreadsMutation`
- ✅ Navigation: `ThreadDetail: { threadId }` + `CreateThread` (modal presentation) added to `RootStackParamList`
- ✅ `discussionsApi.generated.ts` — all 6 hooks: `useGetThreadsQuery`, `useGetThreadsByIdQuery`, `usePostThreadsMutation`, `usePostThreadsByIdRepliesMutation`, `usePostThreadsByIdLikeMutation`, `useDeleteThreadsByIdMutation`

## FSD Import Rules

| Layer      | Can import from                                   |
| ---------- | ------------------------------------------------- |
| `app`      | pages, widgets, features, entities, shared, store |
| `pages`    | widgets, features, entities, shared               |
| `widgets`  | features, entities, shared                        |
| `features` | entities, shared                                  |
| `entities` | shared (no cross-entity imports)                  |
| `shared`   | nothing (leaf layer)                              |

## Decisions

| Decision                  | Rationale                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Expo managed workflow     | Avoids native config; reanimated v4 works in managed with worklets peer                                          |
| Redux Toolkit             | Chosen over Zustand to leverage RTK Query for live API integration                                               |
| Feature-Sliced Design     | Pragmatic 6-layer approach (no processes layer) for scalable architecture                                        |
| Custom tab bar            | Pill design requires fully custom `tabBar` component                                                             |
| Swipe via reanimated v4   | `GestureDetector` + `useAnimatedStyle` for 60fps card drag; babel plugin moved to `react-native-worklets/plugin` |
| Supabase Auth             | 50K MAU free tier; JWTs verifiable server-side; Google OAuth + email/password in v1                              |
| Exact dep pinning         | All package.json versions pinned without `^`/`~` for reproducible builds                                        |
| TypeScript 6 + React 19.2 | Intentionally ahead of Expo SDK 54 recommendations; excluded from `expo install` validation                      |
| No `baseUrl` in tsconfig  | `baseUrl` deprecated in TypeScript 6; paths prefixed with `./` instead                                          |
| `pages/_shared` helpers   | `Screen.tsx` + `ScreenHeader.tsx` avoid duplication across all screens                                           |
| Soft-delete threads       | `deleted_at` column on `threads`/`thread_replies`; never hard-deleted; audit trail preserved                     |
| Dark mode deferred        | `$bg-dark` token exists but not wired in this phase                                                              |

## Ideas to Decide

| Idea | Description | Open Questions |
| ---- | ----------- | -------------- |
| Onboarding: prefill read books + genres | During signup/onboarding, ask the user to (1) search and mark books they've already read and (2) pick favourite genres from a fixed list. Feed both signals to the recommendation engine so the initial Discover feed is personalised from day one. | How many books to ask for? How many genres to require/allow? Skip option? Where in auth flow? Books stored as `status: "finished"` or separate seed table? |

## Verification Checklist

- [x] `npx expo start` boots without errors on iOS and Android
- [x] All 4 bottom tabs navigate correctly; active tab matches `$accent` color
- [x] Swipe card: drag left dismisses, drag right likes, buttons trigger same
- [x] Tapping a card navigates to BookDetail with correct data
- [x] "Add to Library" persists book — appears in Library saved grid
- [x] All 24 color tokens visually match `design-proposal.pen` variables
- [x] Inter font renders in all weight variants (400/500/600/700)
- [x] ScrollView screens scroll correctly with no layout overflow
- [x] Safe area insets work on devices with notch/Dynamic Island
- [x] No TypeScript errors (`npx tsc --noEmit`) — TS 6.0.2 clean
- [x] Discussions: filter chips hit live API; search debounced 300ms
- [x] Thread detail: like toggles persisted; reply appended and visible after refetch
- [x] Thread creation: book picker searches `GET /books?q=`, selection populates `bookId`
- [x] Thread delete: only visible to thread owner; confirmation alert before API call
- [x] Progress badges: live from `GET /me/badges`; empty state shown for new users
- [x] Challenges: live from `GET /challenges`; leaderboard from `GET /challenges/:id/leaderboard`
- [x] Reading Detail: page input with numeric keyboard; `+10`/`+25`/`Finished` chips; PATCH sends `currentPage`
- [x] No `useEffect` for prop→state sync in forms — `key` prop used instead
