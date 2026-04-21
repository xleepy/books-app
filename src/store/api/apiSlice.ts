import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Library", "Feed", "Thread", "Review", "User"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { session: { access_token: string } | null } };
      const token = state.auth?.session?.access_token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});

// keep legacy name for store wiring
export const apiSlice = api;
