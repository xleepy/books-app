import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<GetMeApiResponse, GetMeApiArg>({
      query: () => ({ url: `/me` }),
      providesTags: ["User"],
    }),
    getMeBadges: build.query<GetMeBadgesApiResponse, GetMeBadgesApiArg>({
      query: () => ({ url: `/me/badges` }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as meApi };
export type GetMeApiResponse = /** status 200 Default Response */ User;
export type GetMeApiArg = void;
export type GetMeBadgesApiResponse = /** status 200 Default Response */ {
  data: UserBadge[];
};
export type GetMeBadgesApiArg = void;
export type User = {
  id: string;
  name: string;
  email?: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  xpTotal: number;
  xpCurrentLevel: number;
  xpToNextLevel: number;
  booksFinished: number;
  pagesRead?: number;
  hoursRead?: number;
  streak: number;
  bestStreak: number;
  weekDays: boolean[];
  readingGoal: number;
};
export type ApiError = {
  error: string;
  message: string;
};
export type UserBadge = {
  slug: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  awardedAt: string;
};
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMeBadgesQuery,
  useLazyGetMeBadgesQuery,
} = injectedRtkApi;
