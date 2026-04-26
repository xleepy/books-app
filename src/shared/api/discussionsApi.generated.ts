import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    listThreads: build.query<ListThreadsApiResponse, ListThreadsApiArg>({
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
    createThread: build.mutation<CreateThreadApiResponse, CreateThreadApiArg>({
      query: (queryArg) => ({
        url: `/threads`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Thread"],
    }),
    getThread: build.query<GetThreadApiResponse, GetThreadApiArg>({
      query: (queryArg) => ({ url: `/threads/${queryArg}` }),
      providesTags: ["Thread"],
    }),
    updateThread: build.mutation<UpdateThreadApiResponse, UpdateThreadApiArg>({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.body,
      }),
      invalidatesTags: ["Thread"],
    }),
    deleteThread: build.mutation<DeleteThreadApiResponse, DeleteThreadApiArg>({
      query: (queryArg) => ({ url: `/threads/${queryArg}`, method: "DELETE" }),
      invalidatesTags: ["Thread"],
    }),
    postReply: build.mutation<PostReplyApiResponse, PostReplyApiArg>({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}/replies`,
        method: "POST",
        body: queryArg.body,
      }),
      invalidatesTags: ["Thread"],
    }),
    toggleLike: build.mutation<ToggleLikeApiResponse, ToggleLikeApiArg>({
      query: (queryArg) => ({
        url: `/threads/${queryArg}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Thread"],
    }),
    deleteReply: build.mutation<DeleteReplyApiResponse, DeleteReplyApiArg>({
      query: (queryArg) => ({
        url: `/threads/${queryArg.id}/replies/${queryArg.replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Thread"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as discussionsApi };
export type ListThreadsApiResponse =
  /** status 200 Default Response */ PaginatedThreads;
export type ListThreadsApiArg = {
  filter?: "all" | "popular" | "recent" | "mine";
  search?: string;
  page?: number;
  limit?: number;
};
export type CreateThreadApiResponse = /** status 201 Default Response */ Thread;
export type CreateThreadApiArg = {
  title: string;
  body: string;
  bookId?: string | null;
  spoiler?: boolean;
};
export type GetThreadApiResponse =
  /** status 200 Default Response */ ThreadDetail;
export type GetThreadApiArg = string;
export type UpdateThreadApiResponse = /** status 200 Default Response */ Thread;
export type UpdateThreadApiArg = {
  id: string;
  body: {
    title: string;
    body: string;
  };
};
export type DeleteThreadApiResponse = unknown;
export type DeleteThreadApiArg = string;
export type PostReplyApiResponse =
  /** status 201 Default Response */ ThreadReply;
export type PostReplyApiArg = {
  id: string;
  body: {
    body: string;
  };
};
export type ToggleLikeApiResponse =
  /** status 200 Default Response */ LikeResult;
export type ToggleLikeApiArg = string;
export type DeleteReplyApiResponse = unknown;
export type DeleteReplyApiArg = {
  id: string;
  replyId: string;
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
export type PaginatedThreads = {
  data: Thread[];
  pagination: Pagination;
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
  isOwner: boolean;
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
export type LikeResult = {
  liked: boolean;
  likes: number;
};
export const {
  useListThreadsQuery,
  useLazyListThreadsQuery,
  useCreateThreadMutation,
  useGetThreadQuery,
  useLazyGetThreadQuery,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
  usePostReplyMutation,
  useToggleLikeMutation,
  useDeleteReplyMutation,
} = injectedRtkApi;
