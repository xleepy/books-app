/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: "http://localhost:3000/docs/json",
  apiFile: "./src/store/api/apiSlice.ts",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  flattenArg: true,
  outputFiles: {
    "./src/shared/api/authApi.generated.ts": {
      exportName: "authApi",
      filterEndpoints: [/postAuth/],
    },
    "./src/shared/api/booksApi.generated.ts": {
      exportName: "booksApi",
      filterEndpoints: [
        "getBooks",
        "getBooksFeed",
        "getBooksById",
        "getBooksByIdRecommendations",
        "getSubjects",
      ],
      endpointOverrides: [{ pattern: "getBooksFeed", providesTags: ["Feed"] }],
    },
    "./src/shared/api/reviewsApi.generated.ts": {
      exportName: "reviewsApi",
      filterEndpoints: ["getBooksByIdReviews", "postBooksByIdReviews"],
      endpointOverrides: [
        { pattern: "getBooksByIdReviews", providesTags: ["Review"] },
        { pattern: "postBooksByIdReviews", invalidatesTags: ["Review"] },
      ],
    },
    "./src/shared/api/libraryApi.generated.ts": {
      exportName: "libraryApi",
      filterEndpoints: [
        "getLibraryStats",
        "getLibrary",
        "postLibrary",
        "patchLibraryByBookId",
        "deleteLibraryByBookId",
      ],
      endpointOverrides: [
        { pattern: "getLibraryStats", providesTags: ["Library"] },
        { pattern: "getLibrary", providesTags: ["Library"] },
        {
          pattern: "postLibrary",
          invalidatesTags: ["Library", "Feed", "User"],
        },
        {
          pattern: "patchLibraryByBookId",
          invalidatesTags: ["Library", "User"],
        },
        {
          pattern: "deleteLibraryByBookId",
          invalidatesTags: ["Library", "User"],
        },
      ],
    },
    "./src/shared/api/meApi.generated.ts": {
      exportName: "meApi",
      filterEndpoints: [
        "getMe",
        "getMeBadges",
        "getMePreferences",
        "putMePreferences",
        "postMePushToken",
        "deleteMePushToken",
      ],
      endpointOverrides: [
        { pattern: "getMe", providesTags: ["User"] },
        { pattern: "getMeBadges", providesTags: ["User"] },
        { pattern: "getMePreferences", providesTags: ["User"] },
        { pattern: "putMePreferences", invalidatesTags: ["User"] },
      ],
    },
    "./src/shared/api/swipesApi.generated.ts": {
      exportName: "swipesApi",
      filterEndpoints: ["postSwipes"],
      endpointOverrides: [{ pattern: "postSwipes", invalidatesTags: ["Feed"] }],
    },
    "./src/shared/api/discussionsApi.generated.ts": {
      exportName: "discussionsApi",
      filterEndpoints: [
        "getThreads",
        "getThreadsById",
        "postThreads",
        "deleteThreadsById",
        "postThreadsByIdReplies",
        "postThreadsByIdLike",
      ],
      endpointOverrides: [
        { pattern: "getThreads", providesTags: ["Thread"] },
        { pattern: "getThreadsById", providesTags: ["Thread"] },
        { pattern: "postThreads", invalidatesTags: ["Thread"] },
        { pattern: "deleteThreadsById", invalidatesTags: ["Thread"] },
        { pattern: "postThreadsByIdReplies", invalidatesTags: ["Thread"] },
        { pattern: "postThreadsByIdLike", invalidatesTags: ["Thread"] },
      ],
    },
    "./src/shared/api/challengesApi.generated.ts": {
      exportName: "challengesApi",
      filterEndpoints: [
        "getChallenges",
        "postChallenges",
        "getChallengesById",
        "deleteChallengesById",
        "postChallengesByIdJoin",
        "postChallengesByIdLeave",
        "getChallengesByIdLeaderboard",
      ],
      endpointOverrides: [
        { pattern: "getChallenges", providesTags: ["Challenge"] },
        { pattern: "getChallengesById", providesTags: ["Challenge"] },
        {
          pattern: "getChallengesByIdLeaderboard",
          providesTags: ["Challenge"],
        },
        { pattern: "postChallenges", invalidatesTags: ["Challenge"] },
        { pattern: "deleteChallengesById", invalidatesTags: ["Challenge"] },
        { pattern: "postChallengesByIdJoin", invalidatesTags: ["Challenge"] },
        { pattern: "postChallengesByIdLeave", invalidatesTags: ["Challenge"] },
      ],
    },
  },
};

module.exports = config;
