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
      providesTags: ["Feed"],
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
      query: (queryArg) => ({ url: `/books/${queryArg}` }),
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
    getSubjects: build.query<GetSubjectsApiResponse, GetSubjectsApiArg>({
      query: () => ({ url: `/subjects` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as booksApi };
export type GetBooksFeedApiResponse =
  /** status 200 Default Response */ BookList;
export type GetBooksFeedApiArg = {
  /** Opaque pagination cursor */
  cursor?: string;
  limit?: number;
};
export type GetBooksApiResponse =
  /** status 200 Default Response */ PaginatedBooks;
export type GetBooksApiArg = {
  page?: number;
  limit?: number;
  /** Full-text search on title / author */
  q?: string;
  /** Filter by subject slug */
  tag?: string;
};
export type GetBooksByIdApiResponse = /** status 200 Default Response */ Book;
export type GetBooksByIdApiArg = string;
export type GetBooksByIdRecommendationsApiResponse =
  /** status 200 Default Response */ BookList;
export type GetBooksByIdRecommendationsApiArg = {
  limit?: number;
  id: string;
};
export type GetSubjectsApiResponse =
  /** status 200 Default Response */ SubjectList;
export type GetSubjectsApiArg = void;
export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  tags: string[];
  description: string;
  rating: number;
  reviewCount: number;
  pageCount?: number | null;
};
export type BookList = {
  data: Book[];
  nextCursor?: string | null;
};
export type Pagination = {
  total: number;
  page: number;
  limit: number;
};
export type PaginatedBooks = {
  data: Book[];
  pagination: Pagination;
};
export type ApiError = {
  error: string;
  message: string;
};
export type SubjectList = {
  data: {
    id: string;
    name: string;
    slug: string;
  }[];
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
  useGetSubjectsQuery,
  useLazyGetSubjectsQuery,
} = injectedRtkApi;
