import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLibraryStats: build.query<
      GetLibraryStatsApiResponse,
      GetLibraryStatsApiArg
    >({
      query: () => ({ url: `/library/stats` }),
      providesTags: ["Library"],
    }),
    getLibrary: build.query<GetLibraryApiResponse, GetLibraryApiArg>({
      query: (queryArg) => ({
        url: `/library`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
      providesTags: ["Library"],
    }),
    postLibraryByBookId: build.mutation<
      PostLibraryByBookIdApiResponse,
      PostLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Library"],
    }),
    deleteLibraryByBookId: build.mutation<
      DeleteLibraryByBookIdApiResponse,
      DeleteLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Library"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as libraryApi };
export type GetLibraryStatsApiResponse =
  /** status 200 Default Response */ LibraryStats;
export type GetLibraryStatsApiArg = void;
export type GetLibraryApiResponse = /** status 200 Default Response */ {
  data: LibraryBook[];
  pagination: Pagination;
};
export type GetLibraryApiArg = {
  page?: number;
  limit?: number;
};
export type PostLibraryByBookIdApiResponse = unknown;
export type PostLibraryByBookIdApiArg = {
  bookId: string;
};
export type DeleteLibraryByBookIdApiResponse = unknown;
export type DeleteLibraryByBookIdApiArg = {
  bookId: string;
};
export type LibraryStats = {
  finished: number;
  reading: number;
  saved: number;
};
export type ApiError = {
  error: string;
  message: string;
};
export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
  status: "saved" | "reading" | "finished";
  isCurrent: boolean;
  progressPct: number;
  timeLeftMin?: number | null;
};
export type Pagination = {
  total: number;
  page: number;
  limit: number;
};
export const {
  useGetLibraryStatsQuery,
  useLazyGetLibraryStatsQuery,
  useGetLibraryQuery,
  useLazyGetLibraryQuery,
  usePostLibraryByBookIdMutation,
  useDeleteLibraryByBookIdMutation,
} = injectedRtkApi;
