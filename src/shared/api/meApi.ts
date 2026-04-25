import { api } from "../../store/api/apiSlice";
import type { User } from "./meApi.generated";

export type PatchMeResponse = User;

export type PatchMeBody = {
  name?: string;
  avatarHue?: number;
  readingGoal?: number;
};

export const meApiExtended = api.injectEndpoints({
  endpoints: (build) => ({
    patchMe: build.mutation<PatchMeResponse, PatchMeBody>({
      query: (body) => ({
        url: "/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { usePatchMeMutation } = meApiExtended;
