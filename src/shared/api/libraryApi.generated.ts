import { api } from "../../store/api/apiSlice";
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
    postLibrary: build.mutation<PostLibraryApiResponse, PostLibraryApiArg>({
      query: (queryArg) => ({
        url: `/library`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Library", "Feed", "User"],
    }),
    patchLibraryByBookId: build.mutation<
      PatchLibraryByBookIdApiResponse,
      PatchLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "PATCH",
        body: queryArg.body,
      }),
      invalidatesTags: ["Library", "User", "Challenge"],
    }),
    deleteLibraryByBookId: build.mutation<
      DeleteLibraryByBookIdApiResponse,
      DeleteLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({ url: `/library/${queryArg}`, method: "DELETE" }),
      invalidatesTags: ["Library", "User"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as libraryApi };
export type GetLibraryStatsApiResponse =
  /** status 200 Default Response */ LibraryStats;
export type GetLibraryStatsApiArg = void;
export type GetLibraryApiResponse =
  /** status 200 Default Response */ PaginatedLibraryBooks;
export type GetLibraryApiArg = {
  page?: number;
  limit?: number;
  status?: "want" | "reading" | "finished";
};
export type PostLibraryApiResponse =
  /** status 201 Default Response */ LibraryBook;
export type PostLibraryApiArg = {
  bookId: string;
  status: "want" | "reading" | "finished";
};
export type PatchLibraryByBookIdApiResponse =
  /** status 200 Default Response */ LibraryBook;
export type PatchLibraryByBookIdApiArg = {
  bookId: string;
  body: {
    status?: "want" | "reading" | "finished";
    progressPct?: number;
    currentPage?: number;
    timeLeftMin?: number | null;
  };
};
export type DeleteLibraryByBookIdApiResponse = unknown;
export type DeleteLibraryByBookIdApiArg = string;
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
  progressPct: number;
  currentPage?: number | null;
  pageCount?: number | null;
  timeLeftMin?: number | null;
};
export type Pagination = {
  total: number;
  page: number;
  limit: number;
};
export type PaginatedLibraryBooks = {
  data: LibraryBook[];
  pagination: Pagination;
};
export const {
  useGetLibraryStatsQuery,
  useLazyGetLibraryStatsQuery,
  useGetLibraryQuery,
  useLazyGetLibraryQuery,
  usePostLibraryMutation,
  usePatchLibraryByBookIdMutation,
  useDeleteLibraryByBookIdMutation,
} = injectedRtkApi;
