import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGlobalLeaderboard: build.query<
      GetGlobalLeaderboardApiResponse,
      GetGlobalLeaderboardApiArg
    >({
      query: (queryArg) => ({
        url: `/leaderboard`,
        params: {
          limit: queryArg,
        },
      }),
    }),
    listChallenges: build.query<
      ListChallengesApiResponse,
      ListChallengesApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges`,
        params: {
          filter: queryArg,
        },
      }),
      providesTags: ["Challenge"],
    }),
    createChallenge: build.mutation<
      CreateChallengeApiResponse,
      CreateChallengeApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Challenge"],
    }),
    getChallenge: build.query<GetChallengeApiResponse, GetChallengeApiArg>({
      query: (queryArg) => ({ url: `/challenges/${queryArg}` }),
      providesTags: ["Challenge"],
    }),
    updateChallenge: build.mutation<
      UpdateChallengeApiResponse,
      UpdateChallengeApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg.id}`,
        method: "PATCH",
        body: queryArg.body,
      }),
      invalidatesTags: ["Challenge"],
    }),
    deleteChallenge: build.mutation<
      DeleteChallengeApiResponse,
      DeleteChallengeApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Challenge"],
    }),
    joinChallenge: build.mutation<
      JoinChallengeApiResponse,
      JoinChallengeApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Challenge"],
    }),
    leaveChallenge: build.mutation<
      LeaveChallengeApiResponse,
      LeaveChallengeApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Challenge"],
    }),
    getChallengeLeaderboard: build.query<
      GetChallengeLeaderboardApiResponse,
      GetChallengeLeaderboardApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg.id}/leaderboard`,
        params: {
          limit: queryArg.limit,
        },
      }),
      providesTags: ["Challenge"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as challengesApi };
export type GetGlobalLeaderboardApiResponse =
  /** status 200 Default Response */ LeaderboardList;
export type GetGlobalLeaderboardApiArg = number | undefined;
export type ListChallengesApiResponse =
  /** status 200 Default Response */ ChallengeList;
export type ListChallengesApiArg =
  | ("active" | "monthly" | "yearly" | "weekly" | "custom")
  | undefined;
export type CreateChallengeApiResponse =
  /** status 201 Default Response */ ChallengeDetail;
export type CreateChallengeApiArg = CreateChallengeBody;
export type GetChallengeApiResponse =
  /** status 200 Default Response */ ChallengeDetail;
export type GetChallengeApiArg = string;
export type UpdateChallengeApiResponse =
  /** status 200 Default Response */ ChallengeDetail;
export type UpdateChallengeApiArg = {
  id: string;
  body: {
    title?: string;
    description?: string;
  };
};
export type DeleteChallengeApiResponse = unknown;
export type DeleteChallengeApiArg = string;
export type JoinChallengeApiResponse =
  /** status 200 Default Response */ ChallengeProgress;
export type JoinChallengeApiArg = string;
export type LeaveChallengeApiResponse = unknown;
export type LeaveChallengeApiArg = string;
export type GetChallengeLeaderboardApiResponse =
  /** status 200 Default Response */ LeaderboardList;
export type GetChallengeLeaderboardApiArg = {
  limit?: number;
  id: string;
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
export type LeaderboardList = {
  data: LeaderboardEntry[];
};
export type ApiError = {
  error: string;
  message: string;
};
export type Challenge = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  goal?: string | null;
  variant: string;
  metric: string;
  target: number;
  creatorId?: string | null;
  creatorName?: string | null;
  participantCount: number;
  badgeId?: string | null;
  badgeText?: string | null;
  activeFrom?: string | null;
  activeTo?: string | null;
  current?: number;
  isJoined: boolean;
  isCreator: boolean;
};
export type ChallengeList = {
  data: Challenge[];
};
export type ChallengeDetail = {
  data: Challenge;
};
export type CreateChallengeBody = {
  title: string;
  description?: string;
  variant: "monthly" | "yearly" | "weekly" | "custom";
  metric: "books" | "pages" | "hours" | "streak";
  target: number;
  activeFrom: string;
  activeTo: string;
  badgeId?: string;
};
export type ChallengeProgress = {
  challengeId: string;
  current: number;
  target: number;
  completed: boolean;
  completedAt?: string | null;
};
export const {
  useGetGlobalLeaderboardQuery,
  useLazyGetGlobalLeaderboardQuery,
  useListChallengesQuery,
  useLazyListChallengesQuery,
  useCreateChallengeMutation,
  useGetChallengeQuery,
  useLazyGetChallengeQuery,
  useUpdateChallengeMutation,
  useDeleteChallengeMutation,
  useJoinChallengeMutation,
  useLeaveChallengeMutation,
  useGetChallengeLeaderboardQuery,
  useLazyGetChallengeLeaderboardQuery,
} = injectedRtkApi;
