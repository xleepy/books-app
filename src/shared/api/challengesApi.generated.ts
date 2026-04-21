import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChallenges: build.query<GetChallengesApiResponse, GetChallengesApiArg>({
      query: (queryArg) => ({
        url: `/challenges`,
        params: {
          filter: queryArg.filter,
        },
      }),
    }),
    getChallengesByIdProgress: build.query<
      GetChallengesByIdProgressApiResponse,
      GetChallengesByIdProgressApiArg
    >({
      query: (queryArg) => ({ url: `/challenges/${queryArg.id}/progress` }),
    }),
    getChallengesByIdLeaderboard: build.query<
      GetChallengesByIdLeaderboardApiResponse,
      GetChallengesByIdLeaderboardApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg.id}/leaderboard`,
        params: {
          limit: queryArg.limit,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as challengesApi };
export type GetChallengesApiResponse = /** status 200 Default Response */ {
  data: Challenge[];
};
export type GetChallengesApiArg = {
  filter?: "active" | "monthly" | "yearly";
};
export type GetChallengesByIdProgressApiResponse =
  /** status 200 Default Response */ {
    challengeId: string;
    current: number;
    target: number;
    completed: boolean;
    completedAt?: string | null;
  };
export type GetChallengesByIdProgressApiArg = {
  id: string;
};
export type GetChallengesByIdLeaderboardApiResponse =
  /** status 200 Default Response */ {
    data: LeaderboardEntry[];
  };
export type GetChallengesByIdLeaderboardApiArg = {
  limit?: number;
  id: string;
};
export type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  current: number;
  target: number;
  badgeText: string;
  variant: "monthly" | "yearly";
};
export type ApiError = {
  error: string;
  message: string;
};
export type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  level: number;
  levelTitle: string;
  books: number;
  xp: number;
  isYou?: boolean;
  avatarHue: number;
};
export const {
  useGetChallengesQuery,
  useLazyGetChallengesQuery,
  useGetChallengesByIdProgressQuery,
  useLazyGetChallengesByIdProgressQuery,
  useGetChallengesByIdLeaderboardQuery,
  useLazyGetChallengesByIdLeaderboardQuery,
} = injectedRtkApi;
