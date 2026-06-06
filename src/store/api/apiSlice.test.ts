import { configureStore } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";
import { http, HttpResponse } from "msw";
import { setSession, authReducer } from "@features/auth/model/authSlice";
import { meApi } from "@shared/api/meApi.generated";
import { server } from "../../mocks/server";
import { api } from "./apiSlice";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

function makeSession(accessToken: string): Session {
  return {
    access_token: accessToken,
    refresh_token: "refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id: "user-1",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    },
  } as Session;
}

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["auth/setSession"],
          ignoredPaths: ["auth.session"],
        },
      }).concat(api.middleware),
  });
}

describe("apiSlice", () => {
  it("clears the auth session when the API returns 401", async () => {
    server.use(
      http.get(`${BASE}/me`, ({ request }) => {
        expect(request.headers.get("authorization")).toBe("Bearer expired-token");
        return HttpResponse.json(
          { error: "UNAUTHORIZED", message: "Invalid token" },
          { status: 401 },
        );
      }),
    );

    const store = makeStore();
    store.dispatch(setSession(makeSession("expired-token")));

    const result = await store.dispatch(meApi.endpoints.getMe.initiate());

    expect(result.error).toEqual(
      expect.objectContaining({
        status: 401,
      }),
    );
    expect(store.getState().auth.session).toBeNull();
  });
});
