import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

type AuthErrorLike = { message: string };
type AuthCallback = (event: AuthChangeEvent, session: Session | null) => void;
type AuthResult = Promise<{
  data: { user: User | null; session: Session | null };
  error: AuthErrorLike | null;
}>;
type SessionResult = Promise<{
  data: { session: Session | null };
  error: AuthErrorLike | null;
}>;

type AuthClient = {
  getSession: () => SessionResult;
  onAuthStateChange: (callback: AuthCallback) => {
    data: { subscription: { unsubscribe: () => void } };
  };
  signUp: (credentials: { email: string; password: string }) => AuthResult;
  signInWithPassword: (credentials: {
    email: string;
    password: string;
  }) => AuthResult;
  signInWithIdToken: (credentials: {
    provider: "apple";
    token: string;
  }) => AuthResult;
  signInWithOAuth: (credentials: {
    provider: "google";
    options?: { redirectTo?: string; skipBrowserRedirect?: boolean };
  }) => Promise<{
    data: { provider: string; url: string };
    error: AuthErrorLike | null;
  }>;
  exchangeCodeForSession: (url: string) => AuthResult;
  signOut: () => Promise<{ error: AuthErrorLike | null }>;
};

type SupabaseAuthClient = { auth: AuthClient };

export const isMockAuthEnabled =
  __DEV__ &&
  (process.env.EXPO_PUBLIC_MOCK_AUTH === "true" ||
    process.env.EXPO_PUBLIC_MOCK_API === "true");

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

function createMockUser(email: string): User {
  const now = new Date().toISOString();
  return {
    id: "user-1",
    app_metadata: {
      provider: "email",
      providers: ["email"],
    },
    user_metadata: {
      email,
      name: "Jane Doe",
    },
    aud: "authenticated",
    email,
    role: "authenticated",
    created_at: now,
    updated_at: now,
  } as User;
}

function createMockSession(email = "jane@example.com"): Session {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
  return {
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
    expires_in: 60 * 60,
    expires_at: expiresAt,
    token_type: "bearer",
    user: createMockUser(email),
  };
}

function createMockSupabaseClient(): SupabaseAuthClient {
  const listeners = new Set<AuthCallback>();
  let currentSession: Session | null = createMockSession();

  function emit(event: AuthChangeEvent, session: Session | null) {
    listeners.forEach((callback) => callback(event, session));
  }

  function setSignedIn(email?: string): AuthResult {
    currentSession = createMockSession(email?.trim() || undefined);
    emit("SIGNED_IN", currentSession);
    return Promise.resolve({
      data: { user: currentSession.user, session: currentSession },
      error: null,
    });
  }

  return {
    auth: {
      getSession: () =>
        Promise.resolve({
          data: { session: currentSession },
          error: null,
        }),
      onAuthStateChange: (callback) => {
        listeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(callback);
              },
            },
          },
        };
      },
      signUp: ({ email }) => setSignedIn(email),
      signInWithPassword: ({ email }) => setSignedIn(email),
      signInWithIdToken: () => setSignedIn(),
      signInWithOAuth: ({ provider, options }) => {
        setSignedIn();
        return Promise.resolve({
          data: {
            provider,
            url: options?.redirectTo ?? "books://mock-auth",
          },
          error: null,
        });
      },
      exchangeCodeForSession: () => setSignedIn(),
      signOut: () => {
        currentSession = null;
        emit("SIGNED_OUT", null);
        return Promise.resolve({ error: null });
      },
    },
  };
}

function createRealSupabaseClient(): SupabaseAuthClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }) as unknown as SupabaseAuthClient;
}

export const supabase = isMockAuthEnabled
  ? createMockSupabaseClient()
  : createRealSupabaseClient();
