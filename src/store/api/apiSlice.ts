import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setSession } from "@features/auth/model/authSlice";

type AuthAwareState = {
  auth?: {
    session?: {
      access_token?: string;
    } | null;
  };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AuthAwareState;
    const token = state.auth?.session?.access_token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuthRedirect: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, baseQueryApi, extraOptions) => {
  const result = await rawBaseQuery(args, baseQueryApi, extraOptions);

  if (result.error?.status === 401) {
    baseQueryApi.dispatch(setSession(null));
    // Let the current query settle with its 401 result before clearing cached data.
    setTimeout(() => {
      baseQueryApi.dispatch(api.util.resetApiState());
    }, 0);
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Library", "Feed", "Thread", "Review", "User", "Challenge", "Friend"],
  baseQuery: baseQueryWithAuthRedirect,
  endpoints: () => ({}),
});

// keep legacy name for store wiring
export const apiSlice = api;
