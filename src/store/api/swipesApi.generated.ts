import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postSwipes: build.mutation<PostSwipesApiResponse, PostSwipesApiArg>({
      query: (queryArg) => ({
        url: `/swipes`,
        method: "POST",
        body: { bookId: queryArg.bookId, direction: queryArg.direction },
      }),
      invalidatesTags: ["Feed"],
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
export const { usePostSwipesMutation } = injectedRtkApi;
