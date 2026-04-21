import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<GetMeApiResponse, GetMeApiArg>({
      query: () => ({ url: `/me` }),
    }),
    getMePreferences: build.query<
      GetMePreferencesApiResponse,
      GetMePreferencesApiArg
    >({
      query: () => ({ url: `/me/preferences` }),
    }),
    getMeBadges: build.query<GetMeBadgesApiResponse, GetMeBadgesApiArg>({
      query: () => ({ url: `/me/badges` }),
    }),
    getMeCurrentBook: build.query<
      GetMeCurrentBookApiResponse,
      GetMeCurrentBookApiArg
    >({
      query: () => ({ url: `/me/current-book` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as meApi };
export type GetMeApiResponse = /** status 200 Default Response */ User;
export type GetMeApiArg = void;
export type GetMePreferencesApiResponse =
  /** status 200 Default Response */ Preferences;
export type GetMePreferencesApiArg = void;
export type GetMeBadgesApiResponse = /** status 200 Default Response */ {
  data: UserBadge[];
};
export type GetMeBadgesApiArg = void;
export type GetMeCurrentBookApiResponse =
  /** status 200 Default Response */ LibraryBook;
export type GetMeCurrentBookApiArg = void;
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
export type Preferences = {
  readingGoalMinutes: number;
  reminderTime?: string | null;
  reminderEnabled: boolean;
  preferredGenres: string[];
  notifyPush: boolean;
  notifyWeeklyDigest: boolean;
  notifyChallenge: boolean;
  profileVisibility: "public" | "friends" | "private";
};
export type UserBadge = {
  slug: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  awardedAt: string;
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
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMePreferencesQuery,
  useLazyGetMePreferencesQuery,
  useGetMeBadgesQuery,
  useLazyGetMeBadgesQuery,
  useGetMeCurrentBookQuery,
  useLazyGetMeCurrentBookQuery,
} = injectedRtkApi;
