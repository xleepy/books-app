import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<GetMeApiResponse, GetMeApiArg>({
      query: () => ({ url: `/me` }),
      providesTags: ["User"],
    }),
    getMePreferences: build.query<
      GetMePreferencesApiResponse,
      GetMePreferencesApiArg
    >({
      query: () => ({ url: `/me/preferences` }),
      providesTags: ["User"],
    }),
    putMePreferences: build.mutation<
      PutMePreferencesApiResponse,
      PutMePreferencesApiArg
    >({
      query: (queryArg) => ({
        url: `/me/preferences`,
        method: "PUT",
        body: queryArg,
      }),
      invalidatesTags: ["User"],
    }),
    getMeBadges: build.query<GetMeBadgesApiResponse, GetMeBadgesApiArg>({
      query: () => ({ url: `/me/badges` }),
      providesTags: ["User"],
    }),
    postMePushToken: build.mutation<
      PostMePushTokenApiResponse,
      PostMePushTokenApiArg
    >({
      query: (queryArg) => ({
        url: `/me/push-token`,
        method: "POST",
        body: queryArg,
      }),
    }),
    deleteMePushToken: build.mutation<
      DeleteMePushTokenApiResponse,
      DeleteMePushTokenApiArg
    >({
      query: (queryArg) => ({
        url: `/me/push-token`,
        method: "DELETE",
        body: queryArg,
      }),
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
export type PutMePreferencesApiResponse =
  /** status 200 Default Response */ Preferences;
export type PutMePreferencesApiArg = Preferences;
export type GetMeBadgesApiResponse =
  /** status 200 Default Response */ UserBadgeList;
export type GetMeBadgesApiArg = void;
export type PostMePushTokenApiResponse = /** status 200 Default Response */ {
  id: string;
  token: string;
  platform: string;
};
export type PostMePushTokenApiArg = {
  token: string;
  platform: "ios" | "android";
};
export type DeleteMePushTokenApiResponse = /** status 200 Default Response */ {
  deleted: number;
};
export type DeleteMePushTokenApiArg = {
  token: string;
};
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
export type UserBadgeList = {
  data: UserBadge[];
};
export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMePreferencesQuery,
  useLazyGetMePreferencesQuery,
  usePutMePreferencesMutation,
  useGetMeBadgesQuery,
  useLazyGetMeBadgesQuery,
  usePostMePushTokenMutation,
  useDeleteMePushTokenMutation,
} = injectedRtkApi;
