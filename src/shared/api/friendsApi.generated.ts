import { api } from "../../store/api/apiSlice";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFriends: build.query<GetFriendsApiResponse, GetFriendsApiArg>({
      query: () => ({ url: `/friends` }),
      providesTags: ["Friend"],
    }),
    getPendingRequests: build.query<
      GetPendingRequestsApiResponse,
      GetPendingRequestsApiArg
    >({
      query: () => ({ url: `/friends/pending` }),
      providesTags: ["Friend"],
    }),
    sendFriendRequest: build.mutation<
      SendFriendRequestApiResponse,
      SendFriendRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/friends/request`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Friend"],
    }),
    acceptFriendRequest: build.mutation<
      AcceptFriendRequestApiResponse,
      AcceptFriendRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/friends/accept/${queryArg}`,
        method: "POST",
      }),
      invalidatesTags: ["Friend"],
    }),
    rejectFriendRequest: build.mutation<
      RejectFriendRequestApiResponse,
      RejectFriendRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/friends/reject/${queryArg}`,
        method: "POST",
      }),
      invalidatesTags: ["Friend"],
    }),
    removeFriend: build.mutation<RemoveFriendApiResponse, RemoveFriendApiArg>({
      query: (queryArg) => ({ url: `/friends/${queryArg}`, method: "DELETE" }),
      invalidatesTags: ["Friend"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as friendsApi };
export type GetFriendsApiResponse =
  /** status 200 Default Response */ FriendsList;
export type GetFriendsApiArg = void;
export type GetPendingRequestsApiResponse =
  /** status 200 Default Response */ PendingRequests;
export type GetPendingRequestsApiArg = void;
export type SendFriendRequestApiResponse =
  /** status 201 Default Response */ FriendRequest;
export type SendFriendRequestApiArg = SendFriendRequestBody;
export type AcceptFriendRequestApiResponse =
  /** status 200 Default Response */ Friend;
export type AcceptFriendRequestApiArg = string;
export type RejectFriendRequestApiResponse = unknown;
export type RejectFriendRequestApiArg = string;
export type RemoveFriendApiResponse = unknown;
export type RemoveFriendApiArg = string;
export type Friend = {
  id: string;
  userId: string;
  username: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  friendsSince: string;
  mutualCount: number;
};
export type FriendsList = {
  data: Friend[];
  total: number;
};
export type ApiError = {
  error: string;
  message: string;
};
export type FriendRequest = {
  id: string;
  userId: string;
  username: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
  direction: "incoming" | "outgoing";
  sentAt: string;
};
export type PendingRequests = {
  data: {
    incoming: FriendRequest[];
    outgoing: FriendRequest[];
  };
};
export type SendFriendRequestBody = {
  userId: string;
};
export const {
  useGetFriendsQuery,
  useLazyGetFriendsQuery,
  useGetPendingRequestsQuery,
  useLazyGetPendingRequestsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
} = injectedRtkApi;
