# books-app

React Native / Expo app for discovering and tracking books.

## Getting started

```bash
npm install
npm start        # Expo dev server
npm test         # Jest
npm run typecheck
npm run codegen  # Regenerate RTK Query API clients from OpenAPI spec
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
