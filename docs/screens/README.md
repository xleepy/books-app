# Screen Documentation

Overview of all screens in the app, their purpose, and how they connect.

## Navigation structure

```
RootNavigator (Native Stack)
├── Login                 ← shown when no active Supabase session
├── Tabs (TabNavigator — pill tab bar)
│   ├── Discover          ← tab 1
│   ├── Discussions       ← tab 2
│   ├── Library           ← tab 3
│   └── Compete           ← tab 4 (Challenges)
├── BookDetail            ← stack push, param: { bookId }
├── Progress              ← stack push
├── Settings              ← stack push
├── ThreadDetail          ← stack push, param: { threadId }
└── CreateThread          ← modal presentation (no params)
```

## User flows

### Discover a new book
`Discover` → swipe card or tap → `BookDetail` → "Add to Library" → back to `Discover`

### Browse saved books
`Library` → tab tile → `LibraryList` → tap book → `BookDetail`

### Read and join a discussion
`Discussions` → filter / search → tap thread card → `ThreadDetail` → type reply → send

### Start a new thread
`Discussions` → `+` button → `CreateThread` (modal) → search & link book (optional) → Post → back to `Discussions`

### Delete your own thread
`ThreadDetail` → trash icon (owner only) → confirm in `Alert` → back to `Discussions`

### Check progress & level up
Any avatar tap → `Progress` → Settings icon → `Settings`

### Compete with others
`Compete (Challenges)` → filter Active / Monthly / Yearly / Leaderboard → view live challenge data

## Screens

| File | Route | Type | Design frame |
|------|-------|------|--------------|
| [login.md](login.md) | `Login` | pre-auth | _Login_ |
| [discover.md](discover.md) | `Discover` | tab 1 | _Discover - Swipe_ |
| [book-detail.md](book-detail.md) | `BookDetail` | stack | _Book Detail - Reviews_ |
| [discussions.md](discussions.md) | `Discussions` | tab 2 | _Discussion Threads_ |
| [thread-detail.md](thread-detail.md) | `ThreadDetail` | stack | _Thread Detail_ |
| [create-thread.md](create-thread.md) | `CreateThread` | modal | _Create Thread_ |
| [library.md](library.md) | `Library` | tab 3 | _My Library_ |
| [progress.md](progress.md) | `Progress` | stack | _Reading Stats & Level_ |
| [challenges.md](challenges.md) | `Compete` | tab 4 | _Challenges & Competitions_ |
| [settings.md](settings.md) | `Settings` | stack | _User Settings Screen_ |

## API endpoints consumed per screen

| Screen | Endpoints |
|--------|-----------|
| Discover | `GET /books/feed`, `POST /swipes`, `POST /library` |
| Book Detail | `GET /books/:id`, `GET /books/:id/reviews`, `POST /books/:id/reviews`, `POST /library`, `PATCH /library/:bookId`, `DELETE /library/:bookId` |
| Discussions | `GET /threads` |
| Thread Detail | `GET /threads/:id`, `POST /threads/:id/replies`, `POST /threads/:id/like`, `DELETE /threads/:id` |
| Create Thread | `POST /threads`, `GET /books` (book search) |
| Library | `GET /library`, `GET /library/stats`, `GET /me/current-book` |
| Progress | `GET /me`, `GET /me/badges` |
| Challenges | `GET /challenges`, `GET /challenges/:id/leaderboard` |
| Settings | `GET /me`, `PATCH /me`, `GET /me/preferences`, `PUT /me/preferences` |
