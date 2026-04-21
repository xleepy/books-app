import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postSwipes: build.mutation<PostSwipesApiResponse, PostSwipesApiArg>({
      query: (queryArg) => ({
        url: `/swipes`,
        method: "POST",
        body: { bookId: queryArg.bookId, direction: queryArg.direction },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as swipesApi };
export type PostSwipesApiResponse = unknown;
export type PostSwipesApiArg = {
  bookId: string;
  direction: "left" | "right";
};
export type ApiError = {
  error: string;
  message: string;
};
export const { usePostSwipesMutation } = injectedRtkApi;
