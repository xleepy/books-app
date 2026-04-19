# books-app

React Native / Expo app for discovering and tracking books.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
npm start        # Expo dev server
npm test         # Jest
npm run typecheck
npm run codegen  # Regenerate RTK Query API clients from OpenAPI spec
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Backend base URL (default `http://localhost:3000`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `EXPO_PUBLIC_MOCK_API` | Set to `true` to run with MSW mocks instead of the real backend |

The app requires a Supabase session to render the main navigation. Set `EXPO_PUBLIC_MOCK_API=true` to bypass the auth gate and use MSW fixtures without a real Supabase project.

## API layer

RTK Query clients in `src/store/api/` are generated from the backend OpenAPI spec via `npm run codegen`. The active clients are:

| File | Endpoints |
|------|-----------|
| `booksApi.generated.ts` | `GET /books`, `GET /books/feed`, `GET /books/:id`, `GET /books/:id/recommendations`, `GET /books/:id/reviews`, `POST /books/:id/reviews` |
| `libraryApi.generated.ts` | `GET /library` (filterable by `status`), `GET /library/stats`, `POST /library`, `PATCH /library/:bookId`, `DELETE /library/:bookId` |

Adding a book to the library is also the recommendation signal — the discovery feed excludes library books and personalises by subject overlap with all saved books.

## Navigation

React Navigation stack (`src/app/navigation/`):

```
RootNavigator (Stack, auth-gated)
  └── Tabs
  │   ├── Discover        — swipe deck, tapping a card opens BookDetail
  │   ├── Discussions
  │   ├── Library         — stats tiles + previews; "See all" → LibraryList
  │   └── Compete
  ├── BookDetail { bookId, libraryStatus? }
  │       — libraryStatus present → shows Remove / Reading / Finished actions
  │       — libraryStatus absent  → shows "Add to Library"
  ├── LibraryList { initialStatus? }  — full list with All/Reading/Saved/Finished tabs
  ├── Progress
  └── Settings
```

## Mock API (MSW)

The app uses [Mock Service Worker](https://mswjs.io/) to intercept API calls and return fixture data. This lets you run the full UI without a running backend.

### Dev mode

Set the environment variable before starting Expo:

```bash
EXPO_PUBLIC_MOCK_API=true npm start
```

Or add it to a `.env.local` file at the project root:

```
EXPO_PUBLIC_MOCK_API=true
```

When the flag is set, `index.ts` calls `enableMocking()` before mounting the app. MSW starts its interceptor (`src/mocks/index.ts`) and logs `[MSW] Mock server started` to the console. Unhandled requests are logged as warnings.

### Tests

MSW is enabled automatically for every Jest run — no env var needed. `jest.msw.setup.ts` starts the server before all tests, resets overrides between tests, and closes it afterwards. Unhandled requests throw an error so missing handlers are caught early.

### Handlers

All mock routes live in `src/mocks/handlers.ts`. The base URL is read from `EXPO_PUBLIC_API_URL` (defaults to `http://localhost:3000`), matching the real API client.

To override a handler inside a single test:

```ts
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';

it('handles a 404', () => {
  server.use(
    http.get('http://localhost:3000/books/:id', () =>
      HttpResponse.json({ error: 'NOT_FOUND', message: 'Book not found' }, { status: 404 })
    )
  );
  // ... rest of test
});
```

The override is automatically removed after the test by `afterEach(() => server.resetHandlers())`.
