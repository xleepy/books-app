import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getThreads: build.query<GetThreadsApiResponse, GetThreadsApiArg>({
      query: (queryArg) => ({
        url: `/threads`,
        params: {
          filter: queryArg.filter,
          search: queryArg.search,
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
      providesTags: ["Thread"],
    }),
    postThreads: build.mutation<PostThreadsApiResponse, PostThreadsApiArg>({
      query: (queryArg) => ({
        url: `/threads`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Thread"],
    }),
    getThreadsById: build.query<
      GetThreadsByIdApiResponse,
      GetThreadsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/threads/${queryArg}` }),
      providesTags: ["Thread"],
    }),
    deleteThreadsById: build.mutation<
      DeleteThreadsByIdApiResponse,
      DeleteThreadsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/threads/${queryArg}`, method: "DELETE" }),
      invalidatesTags: ["Thread"],
    }),
    postThreadsByIdReplies: build.mutation<
      PostThreadsByIdRepliesApiResponse,
      PostThreadsByIdRepliesApiArg
    >({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}/replies`,
        method: "POST",
        body: queryArg.body,
      }),
      invalidatesTags: ["Thread"],
    }),
    postThreadsByIdLike: build.mutation<
      PostThreadsByIdLikeApiResponse,
      PostThreadsByIdLikeApiArg
    >({
      query: (queryArg) => ({
        url: `/threads/${queryArg}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Thread"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as discussionsApi };
export type GetThreadsApiResponse = /** status 200 Default Response */ {
  data: Thread[];
  pagination: Pagination;
};
export type GetThreadsApiArg = {
  filter?: "all" | "popular" | "recent" | "mine";
  search?: string;
  page?: number;
  limit?: number;
};
export type PostThreadsApiResponse = /** status 201 Default Response */ Thread;
export type PostThreadsApiArg = {
  title: string;
  body: string;
  bookId?: string | null;
  spoiler?: boolean;
};
export type GetThreadsByIdApiResponse =
  /** status 200 Default Response */ ThreadDetail;
export type GetThreadsByIdApiArg = string;
export type DeleteThreadsByIdApiResponse = unknown;
export type DeleteThreadsByIdApiArg = string;
export type PostThreadsByIdRepliesApiResponse =
  /** status 201 Default Response */ ThreadReply;
export type PostThreadsByIdRepliesApiArg = {
  id: string;
  body: {
    body: string;
  };
};
export type PostThreadsByIdLikeApiResponse =
  /** status 200 Default Response */ {
    liked: boolean;
    likes: number;
  };
export type PostThreadsByIdLikeApiArg = string;
export type Thread = {
  id: string;
  title: string;
  bookContext: string;
  preview: string;
  coverUrl?: string | null;
  replies: number;
  likes: number;
  timeAgo: string;
  spoiler: boolean;
  liked?: boolean;
  creatorName: string;
  creatorAvatarHue: number;
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
export type ThreadReply = {
  id: string;
  body: string;
  timeAgo: string;
  creatorName: string;
  creatorAvatarHue: number;
};
export type ThreadDetail = {
  id: string;
  title: string;
  body: string;
  bookContext: string;
  coverUrl?: string | null;
  likes: number;
  timeAgo: string;
  spoiler: boolean;
  liked?: boolean;
  creatorName: string;
  creatorAvatarHue: number;
  isOwner: boolean;
  replies: ThreadReply[];
};
export const {
  useGetThreadsQuery,
  useLazyGetThreadsQuery,
  usePostThreadsMutation,
  useGetThreadsByIdQuery,
  useLazyGetThreadsByIdQuery,
  useDeleteThreadsByIdMutation,
  usePostThreadsByIdRepliesMutation,
  usePostThreadsByIdLikeMutation,
} = injectedRtkApi;
