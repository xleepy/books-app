# Thread & Challenge Management

**Status:** Completed

---

## Purpose

Allow users to manage content they created within the community and challenges features. Thread owners should be able to edit or delete their threads. Reply authors should be able to remove their own replies. Challenge creators should be able to update challenge details and cancel challenges, with participants being notified of cancellations.

---

## Design Decisions

### Approach Chosen: Overflow Menu (B)

We considered two UX patterns:

| Approach | Description | Decision |
|---|---|---|
| **A — Inline Icons** | Edit/Trash icons visible directly in nav bars and reply rows | Rejected — too visually busy with multiple actions on screen |
| **B — Overflow Menu** | Single `⋮` ellipsis icon opens an action sheet with Edit/Delete options | **Accepted** — cleaner surface, scales to future actions (Pin, Report, Copy link), consistent across Threads and Challenges |

### Thread Edit Scope
- Owner can edit `title` and `body` only.
- `bookId` and `spoiler` are immutable after creation (simplifies validation and avoids context shifts).

### Reply Delete
- Soft-delete via `deletedAt` timestamp (column already exists in Prisma schema).
- No edit capability for replies (keeps threading simple; users can delete and re-post).

### Challenge Edit Scope
- Cosmetic-only: `title` and `description`.
- Target, metric, active dates, and variant are immutable once created. This prevents fairness issues after participants have joined and started progressing.

### Challenge Cancel
- Hard-delete via `DELETE /challenges/:id` (existing behavior).
- All participants receive a push notification after successful deletion.
- Creator cannot "leave" their own challenge (already enforced).

---

## UI/UX Flow

### Thread Detail (Owner View)
1. User opens a thread they created.
2. Header shows `⋮` next to the back button.
3. Tap `⋮` → Action sheet opens with:
   - **Edit Thread** → pushes `EditThreadScreen` (pre-filled form)
   - **Delete Thread** → `Alert.alert` confirmation → `DELETE /threads/:id` → `navigation.goBack()`
4. Own replies show `⋮` on the reply header row.
5. Tap `⋮` on reply → Action sheet opens with:
   - **Delete Reply** → `Alert.alert` confirmation → `DELETE /threads/:id/replies/:replyId` → refetch thread

### Challenge Detail (Creator View)
1. User opens a challenge they created.
2. Header shows `Share` + `⋮`.
3. Tap `⋮` → Action sheet opens with:
   - **Edit Challenge** → pushes `EditChallengeScreen` (title/description editable, rest read-only)
   - **Cancel Challenge** → `Alert.alert` confirmation → `DELETE /challenges/:id` → `navigation.goBack()`
4. Bottom action bar is removed for creators (actions live in overflow menu).

### Edit Screens
- `EditThreadScreen` reuses `CreateThreadScreen` layout with pre-filled state.
- `EditChallengeScreen` reuses `CreateChallengeScreen` layout with locked metric/target/date fields.
- "Create" button label becomes "Save".
- On success: mutate → `unwrap()` → `navigation.goBack()`.
- Parent detail screen auto-refreshes via `refetchOnMountOrArgChange: true`.

---

## API Contract

### Threads

| Method | Route | Auth | Body | Response | Description |
|---|---|---|---|---|---|
| `PATCH` | `/threads/:id` | Bearer | `{ title, body }` | `Thread` | Update thread title/body |
| `DELETE` | `/threads/:id` | Bearer | — | `204` | Soft-delete thread |

### Thread Replies

| Method | Route | Auth | Body | Response | Description |
|---|---|---|---|---|---|
| `DELETE` | `/threads/:id/replies/:replyId` | Bearer | — | `204` | Soft-delete reply |

### Challenges

| Method | Route | Auth | Body | Response | Description |
|---|---|---|---|---|---|
| `PATCH` | `/challenges/:id` | Bearer | `{ title, description }` | `ChallengeDetail` | Update cosmetic fields |
| `DELETE` | `/challenges/:id` | Bearer | — | `204` | Hard-delete + notify participants |

### Error Responses
All endpoints return standard `ApiError` (`{ error, message }`) on failure:
- `404` — Resource not found
- `403` — Not owner/creator
- `401` — Unauthorized

---

## Notification Behavior

### Challenge Cancelled
When a creator cancels a challenge:

1. Backend fetches all `userChallenge` rows for that `challengeId`.
2. Filters out the creator.
3. Sends push notification to each remaining participant:
   - **Title:** `"Challenge Cancelled"`
   - **Body:** `"Monthly Reader was cancelled by the creator."`
4. Respects user preferences: only sent if `notifyPush === true && notifyChallenge === true`.
5. Fire-and-forget (`.catch(() => {})`) so notification failures do not roll back the deletion.

**New service function:** `sendChallengeCancelledNotification(userIds: string[], challengeTitle: string)` in `src/services/notifications.ts`.

---

## Frontend State Management

### RTK Query Tags
- `Thread` tag invalidated by: `createThread`, `deleteThread`, `updateThread`, `postReply`, `toggleLike`, `deleteReply`
- `Challenge` tag invalidated by: `createChallenge`, `deleteChallenge`, `updateChallenge`, `joinChallenge`, `leaveChallenge`

### Codegen
Endpoints are identified by `operationId` in the backend schema. We added explicit `operationId` values to all thread and challenge routes so the codegen filter picks them up reliably (no post-codegen hacks needed).

Generated hooks:
- `useUpdateThreadMutation`
- `useDeleteReplyMutation`
- `useUpdateChallengeMutation`

---

## Testing Notes

### Backend
- All existing integration tests pass (53 tests).
- `deleteChallenge` fetches participants before deletion, then fires `sendChallengeCancelledNotification` to eligible users after successful deletion.

### Frontend
- All existing Jest tests pass (34 tests).
- Overflow menu opens on `⋮` tap for thread owners and reply authors.
- `Alert.alert` appears for destructive actions (delete thread, delete reply, cancel challenge).
- Detail screens use `refetchOnMountOrArgChange: true` so data refreshes after navigating back from edit.
- Reply delete calls `refetch()` after `unwrap()` to update the list immediately.

---

## Implementation Summary

| What | Where |
|---|---|
| Thread edit | `PATCH /threads/:id` → `src/services/threads.ts#updateThread` |
| Thread delete | `DELETE /threads/:id` (already existed, soft-delete) |
| Reply delete | `DELETE /threads/:id/replies/:replyId` → `src/services/threads.ts#deleteReply` |
| Challenge edit | `PATCH /challenges/:id` → `src/services/challenges.ts#updateChallenge` |
| Challenge cancel + notify | `DELETE /challenges/:id` → enhanced with participant push notifications |
| Notification service | `src/services/notifications.ts#sendChallengeCancelledNotification` |
| Edit thread screen | `src/pages/discussions/ui/EditThreadScreen.tsx` |
| Edit challenge screen | `src/pages/create-challenge/ui/EditChallengeScreen.tsx` |
| Overflow menu (thread) | `src/pages/discussions/ui/components/ThreadHeader.tsx` |
| Overflow menu (reply) | `src/pages/discussions/ui/components/ReplyItem.tsx` |
| Overflow menu (challenge) | `src/pages/challenge-detail/ui/ChallengeDetailScreen.tsx` |

---

## Related Documentation

- [User-Created Challenges](./challenges.md) — challenge creation, joining, and detail screens