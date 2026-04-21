import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBooksFeed: build.query<GetBooksFeedApiResponse, GetBooksFeedApiArg>({
      query: (queryArg) => ({
        url: `/books/feed`,
        params: {
          cursor: queryArg.cursor,
          limit: queryArg.limit,
        },
      }),
    }),
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
    getBooksByIdReviews: build.query<
      GetBooksByIdReviewsApiResponse,
      GetBooksByIdReviewsApiArg
    >({
      query: (queryArg) => ({
        url: `/books/${queryArg.id}/reviews`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as booksApi };
export type GetBooksFeedApiResponse = /** status 200 Default Response */ {
  data: Book[];
  nextCursor?: string | null;
};
export type GetBooksFeedApiArg = {
  /** Opaque pagination cursor */
  cursor?: string;
  limit?: number;
};
export type GetBooksApiResponse = /** status 200 Default Response */ {
  data: Book[];
  pagination: Pagination;
};
export type GetBooksApiArg = {
  page?: number;
  limit?: number;
  /** Full-text search on title / author */
  q?: string;
  /** Filter by subject slug */
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
export type GetBooksByIdReviewsApiResponse =
  /** status 200 Default Response */ {
    data: Review[];
    pagination: Pagination;
  };
export type GetBooksByIdReviewsApiArg = {
  page?: number;
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
export type Review = {
  id: string;
  reviewer: string;
  date: string;
  rating: number;
  text: string;
  avatarHue: number;
};
export const {
  useGetBooksFeedQuery,
  useLazyGetBooksFeedQuery,
  useGetBooksQuery,
  useLazyGetBooksQuery,
  useGetBooksByIdQuery,
  useLazyGetBooksByIdQuery,
  useGetBooksByIdRecommendationsQuery,
  useLazyGetBooksByIdRecommendationsQuery,
  useGetBooksByIdReviewsQuery,
  useLazyGetBooksByIdReviewsQuery,
} = injectedRtkApi;
