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
    }),
    postThreads: build.mutation<PostThreadsApiResponse, PostThreadsApiArg>({
      query: (queryArg) => ({
        url: `/threads`,
        method: "POST",
        body: { title: queryArg.title, body: queryArg.body, bookId: queryArg.bookId, spoiler: queryArg.spoiler },
      }),
    }),
    getThreadsById: build.query<
      GetThreadsByIdApiResponse,
      GetThreadsByIdApiArg
    >({
      query: (queryArg) => ({ url: `/threads/${queryArg.id}` }),
    }),
    deleteThreadsById: build.mutation<
      DeleteThreadsByIdApiResponse,
      DeleteThreadsByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    postThreadsByIdReplies: build.mutation<
      PostThreadsByIdRepliesApiResponse,
      PostThreadsByIdRepliesApiArg
    >({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}/replies`,
        method: "POST",
        body: { body: queryArg.body },
      }),
    }),
    postThreadsByIdLike: build.mutation<
      PostThreadsByIdLikeApiResponse,
      PostThreadsByIdLikeApiArg
    >({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}/like`,
        method: "POST",
      }),
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
export type GetThreadsByIdApiArg = {
  id: string;
};
export type DeleteThreadsByIdApiResponse = unknown;
export type DeleteThreadsByIdApiArg = {
  id: string;
};
export type PostThreadsByIdRepliesApiResponse =
  /** status 201 Default Response */ ThreadReply;
export type PostThreadsByIdRepliesApiArg = {
  id: string;
  body: string;
};
export type PostThreadsByIdLikeApiResponse =
  /** status 200 Default Response */ {
    liked: boolean;
    likes: number;
  };
export type PostThreadsByIdLikeApiArg = {
  id: string;
};
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
