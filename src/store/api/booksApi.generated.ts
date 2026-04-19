import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<GetBooksApiResponse, GetBooksApiArg>({
      query: (queryArg) => ({
        url: `/books`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          q: queryArg.q,
          tag: queryArg.tag,
        },
      }),
    }),
    getBooksById: build.query<GetBooksByIdApiResponse, GetBooksByIdApiArg>({
      query: (queryArg) => ({ url: `/books/${queryArg.id}` }),
    }),
    getBooksByIdRecommendations: build.query<
      GetBooksByIdRecommendationsApiResponse,
      GetBooksByIdRecommendationsApiArg
    >({
      query: (queryArg) => ({
        url: `/books/${queryArg.id}/recommendations`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as booksApi };
export type GetBooksApiResponse = /** status 200 Default Response */ {
  data: Book[];
  pagination: Pagination;
};
export type GetBooksApiArg = {
  page?: number;
  limit?: number;
  /** Full-text search */
  q?: string;
  /** Filter by genre/tag */
  tag?: string;
};
export type GetBooksByIdApiResponse = /** status 200 Default Response */ Book;
export type GetBooksByIdApiArg = {
  id: string;
};
export type GetBooksByIdRecommendationsApiResponse =
  /** status 200 Default Response */ {
    data: Book[];
  };
export type GetBooksByIdRecommendationsApiArg = {
  limit?: number;
  id: string;
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
  useGetBooksQuery,
  useLazyGetBooksQuery,
  useGetBooksByIdQuery,
  useLazyGetBooksByIdQuery,
  useGetBooksByIdRecommendationsQuery,
  useLazyGetBooksByIdRecommendationsQuery,
} = injectedRtkApi;
