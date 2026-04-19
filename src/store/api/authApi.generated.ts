import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postAuthRegister: build.mutation<
      PostAuthRegisterApiResponse,
      PostAuthRegisterApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/register`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    postAuthLogin: build.mutation<
      PostAuthLoginApiResponse,
      PostAuthLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/auth/login`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as authApi };
export type PostAuthRegisterApiResponse =
  /** status 201 Default Response */ AuthTokens;
export type PostAuthRegisterApiArg = {
  body: {
    email: string;
    password: string;
    name: string;
  };
};
export type PostAuthLoginApiResponse =
  /** status 200 Default Response */ AuthTokens;
export type PostAuthLoginApiArg = {
  body: {
    email: string;
    password: string;
  };
};
export type AuthTokens = {
  accessToken: string;
};
export type ApiError = {
  error: string;
  message: string;
};
export const { usePostAuthRegisterMutation, usePostAuthLoginMutation } =
  injectedRtkApi;
