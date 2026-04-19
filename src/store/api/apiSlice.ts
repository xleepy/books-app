import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Library"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = null; // TODO: read from auth store once auth is implemented
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});

// keep legacy name for store wiring
export const apiSlice = api;
