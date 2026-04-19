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
          status: queryArg.status,
        },
      }),
      providesTags: ["Library"],
    }),
    postLibraryByBookId: build.mutation<
      PostLibraryByBookIdApiResponse,
      PostLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library`,
        method: "POST",
        body: { bookId: queryArg.bookId, status: queryArg.status ?? "want" },
      }),
      invalidatesTags: ["Library"],
    }),
    patchLibraryByBookId: build.mutation<
      PatchLibraryByBookIdApiResponse,
      PatchLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "PATCH",
        body: {
          ...(queryArg.status !== undefined && { status: queryArg.status }),
          ...(queryArg.progressPct !== undefined && { progressPct: queryArg.progressPct }),
          ...(queryArg.isCurrent !== undefined && { isCurrent: queryArg.isCurrent }),
        },
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
  status?: "want" | "reading" | "finished";
};
export type PostLibraryByBookIdApiResponse = unknown;
export type PostLibraryByBookIdApiArg = {
  bookId: string;
  status?: "want" | "reading" | "finished";
};
export type PatchLibraryByBookIdApiResponse = LibraryBook;
export type PatchLibraryByBookIdApiArg = {
  bookId: string;
  status?: "want" | "reading" | "finished";
  progressPct?: number;
  isCurrent?: boolean;
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
  status: "want" | "reading" | "finished";
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
  usePatchLibraryByBookIdMutation,
  useDeleteLibraryByBookIdMutation,
} = injectedRtkApi;
