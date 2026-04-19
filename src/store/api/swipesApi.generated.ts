import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postSwipes: build.mutation<PostSwipesApiResponse, PostSwipesApiArg>({
      query: (queryArg) => ({
        url: `/swipes`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as swipesApi };
export type PostSwipesApiResponse = unknown;
export type PostSwipesApiArg = {
  body: {
    bookId: string;
    /** like = swipe right, dislike = swipe left, bookmark = save for later */
    action: "like" | "dislike" | "bookmark";
  };
};
export type ApiError = {
  error: string;
  message: string;
};
export const { usePostSwipesMutation } = injectedRtkApi;
