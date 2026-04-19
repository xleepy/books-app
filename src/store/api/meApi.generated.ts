import { api } from "./apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<GetMeApiResponse, void>({
      query: () => ({ url: `/me` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as meApi };
export type GetMeApiResponse = {
  id: string;
  name: string;
  email?: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  xpTotal: number;
  booksFinished: number;
  pagesRead: number;
  hoursRead: number;
  streak: number;
  bestStreak: number;
  weekDays: boolean[];
  readingGoal: number;
};
export type GetMeApiArg = void;
export const { useGetMeQuery, useLazyGetMeQuery } = injectedRtkApi;
