/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: "http://localhost:3000/docs/json",
  apiFile: "./src/store/api/apiSlice.ts",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  outputFiles: {
    "./src/store/api/authApi.generated.ts": {
      exportName: "authApi",
      filterEndpoints: ["postAuthRegister", "postAuthLogin"],
    },
    "./src/store/api/booksApi.generated.ts": {
      exportName: "booksApi",
      filterEndpoints: ["getBooks", "getBooksFeed", "getBooksById", "getBooksByIdRecommendations"],
    },
    "./src/store/api/reviewsApi.generated.ts": {
      exportName: "reviewsApi",
      filterEndpoints: ["getBooksByIdReviews", "postBooksByIdReviews"],
    },
    "./src/store/api/libraryApi.generated.ts": {
      exportName: "libraryApi",
      filterEndpoints: ["getLibraryStats", "getLibrary", "postLibraryByBookId", "deleteLibraryByBookId"],
    },
    "./src/store/api/meApi.generated.ts": {
      exportName: "meApi",
      filterEndpoints: ["getMe"],
    },
    "./src/store/api/swipesApi.generated.ts": {
      exportName: "swipesApi",
      filterEndpoints: ["postSwipes"],
    },
    "./src/store/api/discussionsApi.generated.ts": {
      exportName: "discussionsApi",
      filterEndpoints: ["getDiscussions", "getDiscussionsById", "postDiscussionsByIdLike"],
    },
    "./src/store/api/challengesApi.generated.ts": {
      exportName: "challengesApi",
      filterEndpoints: ["getChallenges", "getChallengesByIdLeaderboard"],
    },
  },
};

module.exports = config;
