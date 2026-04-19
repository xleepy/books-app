/**
 * Call this before registerRootComponent when EXPO_PUBLIC_MOCK_API=true.
 * MSW uses @mswjs/interceptors under the hood which patches global fetch/XHR —
 * this works in the React Native JS runtime (Hermes/JSC) as well as Expo web.
 * Requires: EXPO_PUBLIC_MOCK_API=true in .env.local or app.config.js extra.
 */
export async function enableMocking() {
  if (process.env.EXPO_PUBLIC_MOCK_API !== 'true') return;

  await import('./msw.polyfills');
  const { server } = await import('./server');
  server.listen({ onUnhandledRequest: 'warn' });

  if (__DEV__) console.log('[MSW] Mock server started — all API calls are intercepted');
}
