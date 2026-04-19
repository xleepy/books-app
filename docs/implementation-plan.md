# Books App — Implementation Plan

**Status:** Phases 1–11 complete. Phase 12 blocked until backend Phases 5–6 are done.
**Last updated:** 2026-04-19

> React Native mobile app built from `design-proposal.pen`, using Expo, TypeScript, Redux Toolkit, and Feature-Sliced Design architecture.

## Tech Stack

| Category   | Choice                                                      | Version |
| ---------- | ----------------------------------------------------------- | ------- |
| Framework  | React Native (Expo managed workflow, SDK 54)                | 0.81.5  |
| Language   | TypeScript (strict mode)                                    | 6.0.2   |
| React      | React                                                       | 19.2.5  |
| Navigation | React Navigation (bottom tabs + native stack)               | 6.x     |
| State      | Redux Toolkit + RTK Query (prepped for future API)          | 2.11.2  |
| Animations | react-native-reanimated v4 + react-native-gesture-handler   | 4.1.7   |
| Worklets   | react-native-worklets (required peer dep for reanimated v4) | 0.5.1   |
| Icons      | lucide-react-native                                         | 1.8.0   |
| Typography | @expo-google-fonts/inter                                    | 0.2.3   |
| Data       | Static/mock data (UI prototype)                             | —       |

### Package pinning

All `package.json` versions are **exact** (no `^` or `~`). TypeScript 6.x and React 19.2.x are intentionally newer than Expo SDK 54's recommended versions; they are excluded from `expo install --fix` validation via `"expo.install.exclude"` in `package.json`.

## Screens

| #   | Screen                    | Tab         | Description                                              |
| --- | ------------------------- | ----------- | -------------------------------------------------------- |
| 1   | Discover - Swipe          | DISCOVER    | Swipeable book cards with pass/bookmark/like actions     |
| 2   | Book Detail - Reviews     | — (stack)   | Cover, metadata, synopsis, reviews, "Add to Library" CTA |
| 3   | Discussion Threads        | DISCUSSIONS | Search bar, filter chips, threaded discussion list       |
| 4   | My Library                | LIBRARY     | Stats tiles, currently reading card, saved books grid    |
| 5   | Reading Stats & Level     | — (stack)   | XP level card, streak tracker, 2×2 stats, badges         |
| 6   | Challenges & Competitions | COMPETE     | Active challenges (month/year), leaderboard              |

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
| `$accent-light`         | `#F0D9C8` | Tag backgrounds                                |
| `$accent-green`         | `#4A7C59` | Success indicators                             |
| `$accent-red`           | `#C44B4B` | Error/destructive                              |
| `$bg-primary`           | `#FDFAF6` | Screen backgrounds                             |
| `$bg-secondary`         | `#F5EDE3` | Search bars, stat cards                        |
| `$bg-card`              | `#FFFFFF` | Card surfaces                                  |
| `$bg-dark`              | `#1A1614` | Dark mode (future)                             |
| `$font-primary`         | `#1A1614` | Headings, body text                            |
| `$font-secondary`       | `#7A7068` | Subtitles, descriptions                        |
| `$font-tertiary`        | `#A89E95` | Placeholders                                   |
| `$font-inverse`         | `#FFFFFF` | Text on accent backgrounds                     |
| `$border`               | `#E8DFD4` | Card/tab borders                               |
| `$border-light`         | `#F0EAE2` | Subtle dividers                                |
| `$star-gold`            | `#E8A838` | Star ratings, bookmark icon                    |
| `$tab-inactive`         | `#B8AFA6` | Inactive tab icons/labels                      |
| `$badge-gold`           | `#D4A332` | Leaderboard 1st place border                   |
| `$badge-gold-light`     | `#FDF3DB` | Leaderboard 1st place bg                       |
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
      RootNavigator.tsx               # Stack: TabNavigator + BookDetail + Progress
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
    assets/
      images/
        index.ts                      # Maps cover1–cover4 to required PNG files

  entities/                           # Layer 3: Business entities (types + dumb UI + mock data)
    book/
      model/types.ts                  # Book, BookCoverKey interfaces
      ui/BookCover.tsx                # Image with cornerRadius + shadow
      ui/BookMeta.tsx                 # Title + author + tags row (left/center alignment)
      mock/books.ts                   # 4 static books
    user/
      model/types.ts                  # User, ReadingStats interfaces
      mock/user.ts                    # Static user + reading stats
    discussion/
      model/types.ts                  # Thread interface
      ui/ThreadCard.tsx               # Cover thumbnail + title + preview + stats + timestamp
      mock/discussions.ts             # 4 static threads
    challenge/
      model/types.ts                  # Challenge, LeaderboardEntry interfaces
      ui/ChallengeCard.tsx            # Colored challenge card (monthly/yearly variants)
      ui/LeaderboardRow.tsx           # Rank + avatar + name + level + book count
      mock/challenges.ts              # 2 challenges + leaderboard entries
    review/
      model/types.ts                  # Review interface
      ui/ReviewCard.tsx               # Reviewer info + stars + text
      mock/reviews.ts                 # 3 static reviews

  features/                           # Layer 4: User interactions (slices + interactive UI)
    swipe-book/
      ui/SwipeableCard.tsx            # GestureDetector + useAnimatedStyle (rotate/translate/opacity)
      ui/SwipeActions.tsx             # Pass (56px) / Bookmark (48px) / Like (56px) button row
      model/swipeSlice.ts             # currentIndex, nextCard(), resetDeck()
    add-to-library/
      ui/AddToLibraryButton.tsx       # $accent CTA, plus icon, "Add to Library"
      model/librarySlice.ts           # savedBooks[], addBook(), removeBook()
    filter-list/
      ui/FilterRow.tsx                # Horizontal scrollable filter chips with internal active state
    track-progress/
      model/userSlice.ts              # User + stats + currentBook state from mock data

  widgets/                            # Layer 5: Composite blocks (compose entities + features)
    book-swipe-stack/
      ui/BookSwipeStack.tsx           # Card stack + SwipeActions composed together
    review-section/
      ui/ReviewSection.tsx            # "Reviews" header + summary box + ReviewCard list
    reading-card/
      ui/ReadingCard.tsx              # Currently-reading card with cover + progress bar
    streak-card/
      ui/StreakCard.tsx               # 7-day dot row with flame icon
    level-card/
      ui/LevelCard.tsx                # $xp-purple card with circular badge + XP progress bar
    stats-grid/
      ui/StatsGrid.tsx                # 2x2 stats boxes
    badges-row/
      ui/BadgesRow.tsx                # 3 circular badge icons with labels
    leaderboard/
      ui/LeaderboardSection.tsx       # Header + LeaderboardRow items (gold/silver/bronze borders)

  pages/                              # Layer 6: Full screen composites
    _shared/
      Screen.tsx                      # SafeArea wrapper with optional ScrollView + padding
      ScreenHeader.tsx                # Title + subtitle + right action + Avatar
    discover/ui/DiscoverScreen.tsx
    book-detail/ui/BookDetailScreen.tsx
    discussions/ui/DiscussionsScreen.tsx
    library/ui/LibraryScreen.tsx
    progress/ui/ProgressScreen.tsx
    challenges/ui/ChallengesScreen.tsx

  store/                              # Redux store config (imported by app/providers)
    store.ts                          # configureStore — combines all slices + RTK Query middleware
    api/apiSlice.ts                   # createApi({ baseQuery: fakeBaseQuery(), endpoints: () => ({}) })
```

## Implementation Phases

### Phase 1 — Project Bootstrap & Design System ✅

1. Scaffold project manually in existing directory (skip `create-expo-app` — dir not empty)
2. Install all dependencies (exact pinned versions):
   - `@react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack`
   - `react-native-screens react-native-safe-area-context`
   - `react-native-gesture-handler react-native-reanimated react-native-worklets`
   - `lucide-react-native react-native-svg`
   - `@expo-google-fonts/inter expo-font`
   - `@reduxjs/toolkit react-redux`
3. `babel.config.js` — preset: `babel-preset-expo`, plugin: `react-native-worklets/plugin` (reanimated v4 moved its plugin here)
4. `tsconfig.json` — strict mode, no `baseUrl` (deprecated in TS 6), paths prefixed with `./`
5. `index.ts` — registers app, imports `react-native-gesture-handler` first
6. Create `src/shared/theme/colors.ts` — export all 24 design token constants
7. Create `src/shared/theme/typography.ts` — Inter font style objects
8. Create `src/shared/theme/spacing.ts` — numeric spacing scale + radii
9. Map book cover PNGs in `src/shared/assets/images/index.ts`
10. Create all mock data files under `src/entities/*/mock/`

### Phase 2 — Navigation Structure ✅

1. `src/app/navigation/types.ts` — `RootStackParamList` and `TabParamList`
2. `src/app/navigation/TabNavigator.tsx` — custom `tabBar` prop rendering PillTabBar; 4 tabs: Discover, Discussions, Library, Compete
3. `src/app/navigation/RootNavigator.tsx` — native stack wrapping TabNavigator; BookDetail and Progress as stack screens

### Phase 3 — Shared UI Components ✅

1. `shared/ui/Tag.tsx` — pill chip with `$accent-light` background, `$accent` text
2. `shared/ui/StarRating.tsx` — configurable 1–5 star rating display with half-star support
3. `shared/ui/Avatar.tsx` — initials-based circular avatar with HSL hue prop
4. `shared/ui/Separator.tsx` — 1px `$border-light` horizontal line
5. `shared/ui/PillTabBar.tsx` — 62px pill container, 4px padding, active indicator
6. `shared/ui/FilterChip.tsx` — active (`$accent`) / inactive (`$bg-secondary`) states
7. `shared/ui/ActionButton.tsx` — circular button with icon, configurable size/color/shadow
8. `shared/ui/ProgressBar.tsx` — filled track bar for reading/XP progress

### Phase 4 — Entities (Dumb UI) ✅

1. `entities/book/ui/BookCover.tsx` — image with 12px cornerRadius + shadow
2. `entities/book/ui/BookMeta.tsx` — title (22px bold) + author (14px) + Tag row
3. `entities/review/ui/ReviewCard.tsx` — avatar + name + date + stars + review text
4. `entities/discussion/ui/ThreadCard.tsx` — cover thumbnail + title + book context + preview + stats (replies, likes) + timestamp
5. `entities/challenge/ui/ChallengeCard.tsx` — colored card (challengeBlue or white) with icon, title, progress bar, deadline
6. `entities/challenge/ui/LeaderboardRow.tsx` — rank number + avatar + name + level + books count

### Phase 5 — Features (Interactive) ✅

1. `features/swipe-book/ui/SwipeableCard.tsx` — `Gesture.Pan` + `useAnimatedStyle`: translateX drives rotation (±12°) and opacity; threshold = `SCREEN_WIDTH * 0.25`; callbacks via `runOnJS`
2. `features/swipe-book/ui/SwipeActions.tsx` — 3 ActionButtons: pass (X icon, 56px), bookmark (bookmark icon, 48px, `$star-gold`), like (heart icon, 56px, `$accent` bg)
3. `features/swipe-book/model/swipeSlice.ts` — `currentIndex`, `nextCard()`, `resetDeck()`
4. `features/add-to-library/ui/AddToLibraryButton.tsx` — full-width `$accent` button, 52px height, plus icon + "Add to Library"
5. `features/add-to-library/model/librarySlice.ts` — `savedBooks: Book[]`, `addBook()`, `removeBook()`; initial state has 3 pre-saved books
6. `features/filter-list/ui/FilterRow.tsx` — horizontal row of FilterChips with internal active state
7. `features/track-progress/model/userSlice.ts` — `user`, `stats`, `currentBook` state from mock data

### Phase 6 — Widgets (Composite Blocks) ✅

1. `widgets/book-swipe-stack/ui/BookSwipeStack.tsx` — stacked SwipeableCards + SwipeActions; behind-card shown at scale 0.95
2. `widgets/review-section/ui/ReviewSection.tsx` — "Reviews" header + summary box (big rating number + stars) + ReviewCard list
3. `widgets/reading-card/ui/ReadingCard.tsx` — 72×108 cover + title/author + ProgressBar + "Continue Reading" button
4. `widgets/streak-card/ui/StreakCard.tsx` — Flame + day count + 7 day circles (filled/today/empty states)
5. `widgets/level-card/ui/LevelCard.tsx` — `$xp-purple` bg, 64px badge with level number, XP progress bar
6. `widgets/stats-grid/ui/StatsGrid.tsx` — 2×2 grid of icon + number + label stat boxes (uses `LucideIcon` type)
7. `widgets/badges-row/ui/BadgesRow.tsx` — 3 circular badge icons with labels (uses `LucideIcon` type)
8. `widgets/leaderboard/ui/LeaderboardSection.tsx` — header + LeaderboardRow items (gold border for #1, silver for #2, bronze for #3)

### Phase 7 — Pages (Screens) ✅

Shared helpers: `pages/_shared/Screen.tsx` (SafeArea + optional ScrollView) and `pages/_shared/ScreenHeader.tsx` (title + subtitle + right action + Avatar).

1. **DiscoverScreen** — header row (title + sliders-horizontal icon + avatar) → BookSwipeStack; swipe-right navigates to BookDetail
2. **BookDetailScreen** — ScrollView: back nav → centered BookCover (180×260) → BookMeta (centered) → synopsis → Separator → ReviewSection; sticky AddToLibraryButton at bottom
3. **DiscussionsScreen** — header + add button + search bar + FilterRow (All/Popular/Recent/My Threads) → ThreadCard list
4. **LibraryScreen** — header (title + "47 books" subtitle + avatar) → 3 stats tiles → ReadingCard section → saved books 2×2 grid (reads `state.library.savedBooks`)
5. **ProgressScreen** — header → LevelCard → StreakCard → StatsGrid → "Recent Badges" + BadgesRow
6. **ChallengesScreen** — header → FilterRow (Active/Monthly/Yearly/Leaderboard) → 2 ChallengeCards → LeaderboardSection

### Phase 8 — Redux Store & Wiring ✅

1. `store/store.ts` — `configureStore` combining swipe, library, user slices + RTK Query middleware
2. `store/api/apiSlice.ts` — `createApi({ baseQuery: fakeBaseQuery(), endpoints: () => ({}) })` — empty shell ready for real endpoints
3. `app/providers/StoreProvider.tsx` — wraps children in `<Provider store={store}>`
4. `app/providers/NavigationProvider.tsx` — wraps children in `<NavigationContainer>`
5. `app/index.tsx` — `<GestureHandlerRootView><SafeAreaProvider><StoreProvider><NavigationProvider><RootNavigator /></NavigationProvider></StoreProvider></SafeAreaProvider></GestureHandlerRootView>`
6. Wire Discover: swipe-left → `dispatch(nextCard())`; swipe-right → `dispatch(addBook())` + navigate to BookDetail
7. Wire BookDetail: "Add to Library" → `dispatch(addBook())`
8. Wire Library screen to read from `useSelector(state => state.library.savedBooks)`

### Phase 9 — Polish ✅



1. `SafeAreaView` / `useSafeAreaInsets` applied via `pages/_shared/Screen.tsx` wrapper
2. ScrollView screens: BookDetail, Discussions, Library, Progress, Challenges
3. Lucide icon names verified against design: `compass`, `message-circle`, `book-open`, `trophy`, `sliders-horizontal`, `bookmark`, `heart`, `x`, `chevron-left`, `plus`, `search`, `star`, `flame`, `zap`, `star`
4. `expo.install.exclude` added for `typescript`, `react`, `@types/react` to silence intentional version overrides

### Phase 10 — API Integration ✅ (2026-04-19)

RTK Query code-generated hooks replace all mock data. MSW still active in dev via `EXPO_PUBLIC_MOCK_API=true`.

- ✅ `src/store/api/apiSlice.ts` — `fetchBaseQuery` with `prepareHeaders` injecting `auth.session.access_token`
- ✅ Generated API hooks: `authApi`, `booksApi`, `libraryApi`, `meApi`, `reviewsApi`, `discussionsApi`, `challengesApi`, `swipesApi`
- ✅ `BookSwipeStack` — `useGetBooksFeedQuery`, `usePostSwipesMutation`, `usePostLibraryByBookIdMutation`
- ✅ `LibraryScreen` — `useGetLibraryQuery`, `useGetLibraryStatsQuery`
- ✅ `LibraryListScreen` — full list with status filter tabs; `src/pages/library/ui/LibraryListScreen.tsx`
- ✅ `BookDetailScreen` — `useGetBooksByIdQuery`, `usePatchLibraryByBookIdMutation`, `useDeleteLibraryByBookIdMutation`; shows Remove/Reading/Finished actions when opened from library
- ✅ `DiscussionsScreen` — `useGetDiscussionsQuery` (backend stub → MSW covers in dev)
- ✅ `ChallengesScreen` — `useGetChallengesQuery` (backend stub → MSW covers in dev)
- ✅ `userSlice` — `extraReducers` populates from `meApi.getMe.matchFulfilled`; seeds `ProgressScreen` from real API when authed
- ✅ MSW handlers in `src/mocks/handlers.ts` cover all endpoints with realistic shapes

### Phase 11 — Auth ✅ (2026-04-19)

- ✅ `@supabase/supabase-js` + `expo-secure-store` + `expo-web-browser` installed
- ✅ `src/shared/lib/supabase.ts` — Supabase client with SecureStore session persistence
- ✅ `src/features/auth/model/authSlice.ts` — Redux session state (`session`, `isLoading`)
- ✅ `src/pages/auth/ui/LoginScreen.tsx` — email/password + Google OAuth (PKCE) + Apple Sign-In (iOS only)
- ✅ `RootNavigator` auth gate: shows `LoginScreen` when no session; subscribes to `onAuthStateChange`
- ✅ Settings → Sign Out calls `supabase.auth.signOut()`
- ✅ `app.json` — `scheme: "booksapp"` for OAuth deep-link callback
- ⏳ **Blocked on Supabase credentials** in `.env` before live auth works (see backend Phase 2)

### Phase 12 — Discussions & Challenges live ⏳ not started

Depends on backend Phases 5 (gamification) and 6 (community threads).

- ⏳ Challenges tab: live data from `GET /challenges`, `GET /challenges/:id/leaderboard`; XP/badges/streak from `GET /me`
- ⏳ Discussions tab: live threads, `POST /discussions/:id/like`, thread-detail screen + replies
- ⏳ ProgressScreen: all stats driven by `GET /me` — currently seeds from mock until auth works end-to-end

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
| Redux Toolkit             | Chosen over Zustand to leverage RTK Query for future API integration                                             |
| Feature-Sliced Design     | Pragmatic 6-layer approach (no processes layer) for scalable architecture                                        |
| Custom tab bar            | Pill design requires fully custom `tabBar` component                                                             |
| Swipe via reanimated v4   | `GestureDetector` + `useAnimatedStyle` for 60fps card drag; babel plugin moved to `react-native-worklets/plugin` |
| Static data only          | All content is hardcoded mocks; RTK Query shell prepped but empty                                                |
| Exact dep pinning         | All package.json versions pinned without `^`/`~` for reproducible builds                                         |
| TypeScript 6 + React 19.2 | Intentionally ahead of Expo SDK 54 recommendations; excluded from `expo install` validation                      |
| No `baseUrl` in tsconfig  | `baseUrl` deprecated in TypeScript 6; paths prefixed with `./` instead                                           |
| `pages/_shared` helpers   | `Screen.tsx` + `ScreenHeader.tsx` avoid duplication across all 6 screens                                         |
| Dark mode deferred        | `$bg-dark` token exists but not wired in this phase                                                              |

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
- [x] `npx expo-doctor` — 17/17 checks passed
