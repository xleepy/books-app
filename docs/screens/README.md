# Screen Documentation

Overview of all screens in the app, their purpose, and how they connect.

## Navigation structure

```
RootNavigator (Native Stack)
├── Tabs (TabNavigator — pill tab bar)
│   ├── Discover          ← tab 1
│   ├── Discussions       ← tab 2
│   ├── Library           ← tab 3
│   └── Compete           ← tab 4 (Challenges)
├── BookDetail            ← stack push, param: { bookId }
├── Progress              ← stack push
└── Settings              ← stack push
```

## User flows

### Discover a new book
`Discover` → swipe card or tap → `BookDetail` → "Add to Library" → back to `Discover`

### Browse saved books
`Library` → tap avatar → `Progress`

### Follow discussions
`Discussions` → search / filter by category → read thread cards

### Check progress & level up
Any avatar tap → `Progress` → Settings icon → `Settings`

### Compete with others
`Compete (Challenges)` → filter Active / Monthly / Yearly / Leaderboard → tap avatar → `Progress`

## Screens

| File | Route | Design frame |
|------|-------|--------------|
| [discover.md](discover.md) | `Discover` (tab) | Discover - Swipe |
| [book-detail.md](book-detail.md) | `BookDetail` (stack) | Book Detail - Reviews |
| [discussions.md](discussions.md) | `Discussions` (tab) | Discussion Threads |
| [library.md](library.md) | `Library` (tab) | My Library |
| [challenges.md](challenges.md) | `Compete` (tab) | Challenges & Competitions |
| [progress.md](progress.md) | `Progress` (stack) | Reading Stats & Level |
| [settings.md](settings.md) | `Settings` (stack) | User Settings Screen |
