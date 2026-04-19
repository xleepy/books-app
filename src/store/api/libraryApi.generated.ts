import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLibrary: build.query<GetLibraryApiResponse, GetLibraryApiArg>({
      query: (queryArg) => ({
        url: `/library`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
    postLibraryByBookId: build.mutation<
      PostLibraryByBookIdApiResponse,
      PostLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "POST",
      }),
    }),
    deleteLibraryByBookId: build.mutation<
      DeleteLibraryByBookIdApiResponse,
      DeleteLibraryByBookIdApiArg
    >({
      query: (queryArg) => ({
        url: `/library/${queryArg.bookId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as libraryApi };
export type GetLibraryApiResponse = /** status 200 Default Response */ {
  data: Book[];
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
export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
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
  useGetLibraryQuery,
  useLazyGetLibraryQuery,
  usePostLibraryByBookIdMutation,
  useDeleteLibraryByBookIdMutation,
} = injectedRtkApi;
