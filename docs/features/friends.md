# Friends — Frontend Specification

> Status: Draft | Target: MVP
> Pattern: Spec-Driven Development (SDD) — UI/API contract defined before implementation.

---

## 1. Overview

Enable users to build a **friends list** by sending/receiving friend requests, managing pending approvals, and removing existing friends. Friends will unlock social features (shared reading progress, leaderboard comparisons, challenge invites) in future iterations.

---

## 2. API Contract (Backend → Frontend)

The frontend relies on the following API surface.

### 2.1 Endpoints

| Method | Route | Auth | Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/friends` | Bearer | — | `FriendsList` | Get accepted friends list |
| `GET` | `/friends/pending` | Bearer | — | `PendingRequests` | Get incoming + outgoing pending requests |
| `POST` | `/friends/request` | Bearer | `{ userId: string }` | `FriendRequest` | Send a friend request |
| `POST` | `/friends/accept/:requestId` | Bearer | — | `Friend` | Accept an incoming friend request |
| `POST` | `/friends/reject/:requestId` | Bearer | — | `204` | Reject an incoming friend request |
| `DELETE` | `/friends/:friendshipId` | Bearer | — | `204` | Remove a friend (either direction) |

### 2.2 Error Responses

All endpoints return standard `ApiError` (`{ error, message }`) on failure:
- `400` — Cannot friend yourself / request already exists / already friends
- `401` — Unauthorized
- `403` — Not the recipient of this pending request
- `404` — User not found / request not found / friendship not found
- `409` — Duplicate request

### 2.3 Types

```typescript
// Friend (accepted connection)
type Friend = {
  id: string;               // friendship record ID
  userId: string;           // the friend's user ID
  username: string;
  avatarUrl?: string;
  level: number;            // reading level
  friendsSince: string;     // ISO date
  mutualCount?: number;     // mutual friends count
};

// FriendRequest (pending)
type FriendRequest = {
  id: string;               // request record ID
  userId: string;           // the other user's ID
  username: string;
  avatarUrl?: string;
  level: number;
  direction: 'incoming' | 'outgoing';
  sentAt: string;           // ISO date
};

// Response wrappers
type FriendsList = {
  data: Friend[];
  total: number;
};

type PendingRequests = {
  data: {
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  };
};

type SendFriendRequestPayload = {
  userId: string;
};
```

---

## 3. State Management (Redux + RTK Query)

### 3.1 RTK Query Endpoints

```typescript
// Queries
getFriends: build.query<FriendsList, void>
getPendingRequests: build.query<PendingRequests, void>

// Mutations
sendFriendRequest: build.mutation<FriendRequest, SendFriendRequestPayload>
acceptFriendRequest: build.mutation<Friend, { requestId: string }>
rejectFriendRequest: build.mutation<void, { requestId: string }>
removeFriend: build.mutation<void, { friendshipId: string }>
```

### 3.2 Cache Invalidation

| Mutation | Invalidates |
|---|---|
| `sendFriendRequest` | `getPendingRequests` |
| `acceptFriendRequest` | `getFriends`, `getPendingRequests` |
| `rejectFriendRequest` | `getPendingRequests` |
| `removeFriend` | `getFriends` |

> Rule: Mutations must use `.unwrap()` with `try/catch` for error handling (per REDUX_GUIDE).

### 3.3 RTK Query Tag

- `Friend` tag invalidated by: `sendFriendRequest`, `acceptFriendRequest`, `rejectFriendRequest`, `removeFriend`

---

## 4. Navigation Changes

Add to the **Profile / Social Stack Navigator** (or a new Friends stack):

```
ProfileScreen (existing, or new entry point)
  └─> FriendsListScreen (NEW)
      ├─> PendingRequestsScreen (NEW — modal preferred)
      └─> FriendshipActionSheet (inline / bottom sheet)
```

### 4.1 Screen Transitions

- **FriendsListScreen**: Push (right-to-left) from Profile
- **PendingRequestsScreen**: Modal presentation (bottom-to-top), `presentation: 'modal'`
- **Add Friend**: Inline search or via contextual action from user profiles / challenge leaderboards

---

## 5. UI/UX Specification

### 5.1 Friends List Screen (NEW)

**Layout (vertical scroll):**

```
┌─────────────────────────────┐
│ ←  Friends                  │  ← Nav header
├─────────────────────────────┤
│ [Search or add friend...]   │  ← Text input leading to user search
├─────────────────────────────┤
│ Pending Requests     (3) →  │  ← Tap → PendingRequestsScreen
├─────────────────────────────┤
│ My Friends (42)             │
│ ┌─────────────────────────┐ │
│ │ [avatar] Username       │ │  ← FriendRow
│ │ Level 12 · 8 mutual     │ │
│ │                    [⋮]  │ │  ← Overflow: Remove Friend
│ └─────────────────────────┘ │
│ ...                         │
├─────────────────────────────┤
│ [Empty state graphic]       │  ← When 0 friends
│ Start adding friends to     │
│ see their reading progress! │
└─────────────────────────────┘
```

**States:**

| State | UI |
|---|---|
| Loading | `ActivityIndicator` centered |
| Empty | Illustration + "Add friends to get started" CTA |
| Loaded | Scrollable `FlatList` of `FriendRow` components |
| Error | Full-screen error with retry button |

### 5.2 Pending Requests Screen (NEW)

**Layout (modal):**

```
┌─────────────────────────────┐
│ ←  Pending Requests         │
├─────────────────────────────┤
│ INCOMING (2)                │
│ ┌─────────────────────────┐ │
│ │ [avatar] Username       │ │  ← IncomingRequestRow
│ │ Level 8                 │ │
│ │ [Accept]    [Reject]    │ │  ← Pill buttons
│ └─────────────────────────┘ │
│ ...                         │
├─────────────────────────────┤
│ OUTGOING (1)                │
│ ┌─────────────────────────┐ │
│ │ [avatar] Username       │ │  ← OutgoingRequestRow (non-actionable)
│ │ Request sent · 2d ago   │ │
│ │               [Cancel]  │ │  ← Text button to cancel request
│ └─────────────────────────┘ │
│ ...                         │
├─────────────────────────────┤
│ [Empty state text]          │  ← When no pending requests
│ No pending friend requests. │
└─────────────────────────────┘
```

**Behavior:**
- Accept → optimistic removal from incoming list, appears in friends list
- Reject → optimistic removal from incoming list
- Cancel outgoing → optimistic removal from outgoing list
- On error, roll back optimistically and show Toast

### 5.3 Sending a Friend Request

**Entry points:**
1. **Search bar** on Friends screen → type username → tap result → sends request
2. **User profile** → "Add Friend" button (visible when not friends and no pending request)
3. **Leaderboard / thread** → tap user avatar → "Add Friend" action in overflow menu

**After sending:**
- Button text changes to "Request Sent" (disabled)
- Toast: `"Friend request sent to @username"`
- Pending requests badge updates on the Friends screen

### 5.4 Removing a Friend

**Entry point:** `⋮` overflow menu on `FriendRow` → "Remove Friend"

**Confirmation:**
```
Alert.alert(
  "Remove Friend",
  "Are you sure you want to remove @username from your friends list?",
  [{ text: "Cancel", style: "cancel" }, { text: "Remove", style: "destructive" }]
)
```

**After removal:**
- Optimistic removal from list
- Toast: `"@username removed from friends"`
- Mutual friend counts may shift

---

## 6. Component Breakdown (FSD)

### New Components

| Component | Layer | Location |
|---|---|---|
| `FriendsListScreen` | pages | `src/pages/friends/ui/` |
| `PendingRequestsScreen` | pages | `src/pages/pending-requests/ui/` |
| `FriendRow` | widgets | `src/widgets/friend-row/ui/` |
| `IncomingRequestRow` | widgets | `src/widgets/incoming-request-row/ui/` |
| `OutgoingRequestRow` | widgets | `src/widgets/outgoing-request-row/ui/` |
| `AddFriendButton` | features | `src/features/add-friend/ui/` |
| `AcceptRejectButtons` | features | `src/features/accept-reject/u i/` |
| `RemoveFriendButton` | features | `src/features/remove-friend/ui/` |
| `FriendSearchInput` | features | `src/features/friend-search/ui/` |

### Updated Components

| Component | Change |
|---|---|
| `ProfileScreen` (or Settings) | Add "Friends" row → navigates to `FriendsListScreen` |
| User avatar components (leaderboard, threads) | Add "Add Friend" action if applicable |

---

## 7. Open Questions

| # | Question | Resolution |
|---|---|---|
| 1 | Is there a friend limit per user? | TBD: MVP no limit, consider cap at 500 |
| 2 | Should removing a friend notify the other user? | MVP: No. Silent removal. |
| 3 | Can a rejected request be re-sent immediately? | Yes, but only if the previous request was rejected (not just expired). |
| 4 | Do friend requests expire? | TBD: MVP no expiration, consider 30-day auto-expiry |
| 5 | Are friends visible to other users? | TBD: MVP private (only mutual count shown) |
| 6 | Should "Add Friend" appear on the user's own profile? | No — hidden when viewing own profile |

---

## 8. Acceptance Criteria

- [ ] User can view their friends list (avatar, username, level, friends since date)
- [ ] User can see a badge with count of pending incoming requests on the Friends screen
- [ ] User can navigate to Pending Requests screen and see incoming/outgoing separated
- [ ] User can accept an incoming request (optimistic update + toast)
- [ ] User can reject an incoming request (optimistic update + toast)
- [ ] User can cancel an outgoing request (optimistic update + toast)
- [ ] User can remove a friend via overflow menu with destructive confirmation
- [ ] User can send a friend request via search bar (by username)
- [ ] User can send a friend request from another user's profile or avatar context menu
- [ ] "Add Friend" button states: Add Friend → Request Sent (disabled) → Friends (hidden or overflow)
- [ ] Empty states render for both friends list and pending requests
- [ ] All mutations use `.unwrap()` with `try/catch` error handling
- [ ] All loading states show `ActivityIndicator`
- [ ] TypeScript `typecheck` passes with no errors

---

## 9. Design Reference

All screens are designed in `docs/designs/design-proposal.pen` (see [Pencil Design Skill](../PENCIL_SKILL.md) for platform patterns and conventions).

### 9.1 Frame Inventory

| Frame | Screen | Platform | Key Treatment |
|---|---|---|---|
| `hsogN` | Friends List | Material 3 (Android) | `$bg-card` cards, full-width tab bar, 4px blur shadows |
| `ct6hv` | Pending Requests | Material 3 (Android) | Modal layout, Accept/Reject pills, Cancel link |
| `yrjJ5` | Friends List | Glass UI (Apple) | Frosted `#FFFFFFF0` cards, 20px radius, floating pill nav |
| `f8Ltcd` | Pending Requests | Glass UI (Apple) | Frosted cards, floating pill nav |

### 9.2 Settings Entry Point

Both Settings variants (`zQK8M` — M3, `c3zBx7` — Glass UI) include a Friends row below the profile card:
- `users` icon in a 32x32 `$accent-light` circle
- Pending-request count badge (`$accent` pill, `$font-inverse` text)
- Chevron-right disclosure indicator
- Taps to push `FriendsListScreen`

### 9.3 Design Decisions

| Decision | Rationale |
|---|---|
| Pending row uses card pattern, not inline | Matches Settings toggle-row pattern — consistent tap targets and visual hierarchy |
| Friend rows use avatar initial, not photo | Matches the Settings avatar pattern; photos come from CDN at runtime |
| Badge on Pending row vs section header | Badge is immediately scannable; section headers are static labels |
| Glass UI uses 20px card radius (vs 16px M3) | Larger radius reads as softer/glassier; matches existing Glass screens |
| Glass UI has floating pill nav (not full-width) | Signature iOS pattern — pill `#FFFFFFE6` with 16px blur, 0.5px glass stroke |
| Accept/Reject are horizontal pill buttons | Two-action pattern: filled primary (Accept) + outlined secondary (Reject) |
| Cancel is a text link, not a button | Destructive but non-urgent; avoids competing with Accept/Reject CTAs |

### 9.4 States Covered

| State | Friends List | Pending Requests |
|---|---|---|
| **Loaded** | Scrollable card of friend rows with dividers | Incoming/outgoing cards with action buttons |
| **Loading** | `ActivityIndicator` centered (not drawn — runtime concern) | Same |
| **Empty** | Centered illustration + "Add friends to get started" CTA (not drawn) | "No pending friend requests" text |
| **Error** | Full-screen error with retry (not drawn) | Same |
| **Optimistic** | Row removed on remove friend; rollback on error | Row removed on accept/reject/cancel; rollback on error |

---

## 10. Related Files

| File | Purpose |
|---|---|
| `../books-app-backend/docs/features/friends.md` | Backend feature specification (to be created) |
| `docs/designs/design-proposal.pen` | Pencil designs — frames `hsogN`, `ct6hv`, `yrjJ5`, `f8Ltcd` |
| `docs/PENCIL_SKILL.md` | Platform patterns (M3 vs Glass UI) and design token reference |
| `src/shared/api/friendsApi.generated.ts` | Generated RTK Query API (regenerate after backend) |
| `src/entities/friend/model/types.ts` | Friend domain types (to be created) |

---

*Spec-Driven Development: API contract → Types → UI Spec → Component breakdown → Design → Implementation.*
