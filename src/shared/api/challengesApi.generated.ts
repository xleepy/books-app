import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChallenges: build.query<GetChallengesApiResponse, GetChallengesApiArg>({
      query: (queryArg) => ({
        url: `/challenges`,
        params: {
          filter: queryArg,
        },
      }),
      providesTags: ["Challenge"],
    }),
    postChallenges: build.mutation<
      PostChallengesApiResponse,
      PostChallengesApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Challenge"],
    }),
    getChallengesById: build.query<
      GetChallengesByIdApiResponse,
      GetChallengesByIdApiArg
    >({
      query: (queryArg) => ({ url: `/challenges/${queryArg}` }),
      providesTags: ["Challenge"],
    }),
    deleteChallengesById: build.mutation<
      DeleteChallengesByIdApiResponse,
      DeleteChallengesByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Challenge"],
    }),
    postChallengesByIdJoin: build.mutation<
      PostChallengesByIdJoinApiResponse,
      PostChallengesByIdJoinApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Challenge"],
    }),
    postChallengesByIdLeave: build.mutation<
      PostChallengesByIdLeaveApiResponse,
      PostChallengesByIdLeaveApiArg
    >({
      query: (queryArg) => ({
        url: `/challenges/${queryArg}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Challenge"],
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
      providesTags: ["Challenge"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as challengesApi };
export type GetChallengesApiResponse =
  /** status 200 Default Response */ ChallengeList;
export type GetChallengesApiArg =
  | ("active" | "monthly" | "yearly" | "weekly" | "custom")
  | undefined;
export type PostChallengesApiResponse =
  /** status 201 Default Response */ ChallengeDetail;
export type PostChallengesApiArg = CreateChallengeBody;
export type GetChallengesByIdApiResponse =
  /** status 200 Default Response */ ChallengeDetail;
export type GetChallengesByIdApiArg = string;
export type DeleteChallengesByIdApiResponse = unknown;
export type DeleteChallengesByIdApiArg = string;
export type PostChallengesByIdJoinApiResponse =
  /** status 200 Default Response */ ChallengeProgress;
export type PostChallengesByIdJoinApiArg = string;
export type PostChallengesByIdLeaveApiResponse = unknown;
export type PostChallengesByIdLeaveApiArg = string;
export type GetChallengesByIdLeaderboardApiResponse =
  /** status 200 Default Response */ LeaderboardList;
export type GetChallengesByIdLeaderboardApiArg = {
  limit?: number;
  id: string;
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
export type ApiError = {
  error: string;
  message: string;
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
export const {
  useGetChallengesQuery,
  useLazyGetChallengesQuery,
  usePostChallengesMutation,
  useGetChallengesByIdQuery,
  useLazyGetChallengesByIdQuery,
  useDeleteChallengesByIdMutation,
  usePostChallengesByIdJoinMutation,
  usePostChallengesByIdLeaveMutation,
  useGetChallengesByIdLeaderboardQuery,
  useLazyGetChallengesByIdLeaderboardQuery,
} = injectedRtkApi;
