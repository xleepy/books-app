import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
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
    postBooksByIdReviews: build.mutation<
      PostBooksByIdReviewsApiResponse,
      PostBooksByIdReviewsApiArg
    >({
      query: (queryArg) => ({
        url: `/books/${queryArg.id}/reviews`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as reviewsApi };
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
export type PostBooksByIdReviewsApiResponse =
  /** status 201 Default Response */ Review;
export type PostBooksByIdReviewsApiArg = {
  id: string;
  body: {
    rating: number;
    text: string;
  };
};
export type Review = {
  id: string;
  reviewer: string;
  date: string;
  rating: number;
  text: string;
  avatarHue: number;
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
  useGetBooksByIdReviewsQuery,
  useLazyGetBooksByIdReviewsQuery,
  usePostBooksByIdReviewsMutation,
} = injectedRtkApi;
