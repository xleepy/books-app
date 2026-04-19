import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDiscussions: build.query<
      GetDiscussionsApiResponse,
      GetDiscussionsApiArg
    >({
      query: (queryArg) => ({
        url: `/discussions`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          bookId: queryArg.bookId,
        },
      }),
    }),
    getDiscussionsById: build.query<
      GetDiscussionsByIdApiResponse,
      GetDiscussionsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/discussions/${queryArg.id}` }),
    }),
    postDiscussionsByIdLike: build.mutation<
      PostDiscussionsByIdLikeApiResponse,
      PostDiscussionsByIdLikeApiArg
    >({
      query: (queryArg) => ({
        url: `/discussions/${queryArg.id}/like`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as discussionsApi };
export type GetDiscussionsApiResponse = /** status 200 Default Response */ {
  data: Thread[];
  pagination: Pagination;
};
export type GetDiscussionsApiArg = {
  page?: number;
  limit?: number;
  /** Filter threads by book */
  bookId?: string;
};
export type GetDiscussionsByIdApiResponse =
  /** status 200 Default Response */ Thread;
export type GetDiscussionsByIdApiArg = {
  id: string;
};
export type PostDiscussionsByIdLikeApiResponse =
  /** status 200 Default Response */ {
    liked: boolean;
    likes: number;
  };
export type PostDiscussionsByIdLikeApiArg = {
  id: string;
};
export type Thread = {
  id: string;
  title: string;
  bookContext: string;
  preview: string;
  coverUrl: string;
  replies: number;
  likes: number;
  timeAgo: string;
  spoiler?: boolean;
  liked?: boolean;
};
export type Pagination = {
  total: number;
  page: number;
  limit: number;
};
export type ApiError = {
  error: string;
  message: string;
};
export const {
  useGetDiscussionsQuery,
  useLazyGetDiscussionsQuery,
  useGetDiscussionsByIdQuery,
  useLazyGetDiscussionsByIdQuery,
  usePostDiscussionsByIdLikeMutation,
} = injectedRtkApi;
