import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postAuthLogout: build.mutation<
      PostAuthLogoutApiResponse,
      PostAuthLogoutApiArg
    >({
      query: () => ({ url: `/auth/logout`, method: "POST" }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as authApi };
export type PostAuthLogoutApiResponse = /** status 200 Default Response */ {
  ok: boolean;
};
export type PostAuthLogoutApiArg = void;
export type ApiError = {
  error: string;
  message: string;
};
export const { usePostAuthLogoutMutation } = injectedRtkApi;
