# Thread Detail Screen

**Route:** `ThreadDetail` (stack, param: `{ threadId: string }`)
**File:** [src/pages/discussions/ui/ThreadDetailScreen.tsx](../../src/pages/discussions/ui/ThreadDetailScreen.tsx)
**Design frame:** _Thread Detail_ in `docs/designs/design-proposal.pen`

## Purpose

Full view of a single discussion thread. Displays the thread body, all replies in chronological order, a like toggle, and a fixed reply input. Thread owners see a delete button in the header.

## Layout

```
┌───────────────────────────────┐
│  ←  Thread title     [🗑️ ow.] │  ← back + trash icon (owner only)
├───────────────────────────────┤  ← border
│  ScrollView                   │
│  ┌───────────────────────────┐│
│  │ [cover]  Book · Author    ││  ← thread header card
│  │          Thread Title     ││
│  │          ⚠ Spoilers       ││  ← conditional tag
│  │                           ││
│  │  Full body text           ││
│  │                           ││
│  │  [👤 Name]  2h ago   ♡ 4  ││  ← author + like toggle
│  └───────────────────────────┘│
│                               │
│  3 Replies                    │
│  ┌───────────────────────────┐│
│  │ [👤]  AuthorName  5m ago  ││  ← ReplyItem
│  │  Reply body text          ││
│  └───────────────────────────┘│
│  ┌───────────────────────────┐│
│  │ [👤]  …                   ││
│  └───────────────────────────┘│
└───────────────────────────────┘
│  [Reply input…]          [→]  │  ← fixed reply bar
└───────────────────────────────┘
```

## User flow

1. Arrived from `DiscussionsScreen` carrying `threadId`.
2. `useGetThreadsByIdQuery({ id: threadId })` fetches the full thread with all replies.
3. **Like button** — calls `POST /threads/:id/like`; result is reflected optimistically in local state (`liked`, `localLikes`); server is source of truth on next fetch.
4. **Reply bar** — `TextInput` at the bottom of the screen; `KeyboardAvoidingView` keeps it above the keyboard. Submit button is disabled while the input is empty or the mutation is in-flight. On success, input clears, thread is refetched, and the `ScrollView` scrolls to the bottom.
5. **Delete button** (owner only) — a `Trash2` icon appears in the header when `thread.isOwner === true`. Tapping it shows a native `Alert.alert` confirmation. On confirm, calls `DELETE /threads/:id`; on success, navigates back to `Discussions`.
6. **Back arrow** → `navigation.goBack()`.

## Navigation targets

| Trigger | Destination |
|---------|-------------|
| Back button | `Discussions` (or wherever the stack came from) |
| Delete + confirm | `navigation.goBack()` after successful delete |

## Key components used

| Component | Source |
|-----------|--------|
| `BookCover` | `@entities/book/ui/BookCover` |
| `Avatar` | `@shared/ui` |

## API

| Hook | Endpoint | Notes |
|------|----------|-------|
| `useGetThreadsByIdQuery` | `GET /threads/:id` | Returns `ThreadDetail` with embedded `replies[]` |
| `usePostThreadsByIdLikeMutation` | `POST /threads/:id/like` | Toggles like; returns `{ liked, likes }` |
| `usePostThreadsByIdRepliesMutation` | `POST /threads/:id/replies` | Appends reply; screen refetches after success |
| `useDeleteThreadsByIdMutation` | `DELETE /threads/:id` | Soft-deletes; 403 if not owner |

## State

No Redux slice. All state is local:

| Variable | Type | Purpose |
|----------|------|---------|
| `replyText` | `string` | Controlled reply input |
| `liked` | `boolean \| undefined` | Optimistic like override; `undefined` defers to API |
| `localLikes` | `number \| undefined` | Optimistic like count; `undefined` defers to API |
