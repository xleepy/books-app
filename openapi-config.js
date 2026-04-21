/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: "http://localhost:3000/docs/json",
  apiFile: "./src/store/api/apiSlice.ts",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  outputFiles: {
    "./src/shared/api/authApi.generated.ts": {
      exportName: "authApi",
      filterEndpoints: [/postAuth/],
    },
    "./src/shared/api/booksApi.generated.ts": {
      exportName: "booksApi",
      filterEndpoints: [/^getBooks/, /^getBooksById/, /^getBooksFeed/],
    },
    "./src/shared/api/reviewsApi.generated.ts": {
      exportName: "reviewsApi",
      filterEndpoints: [/Review/],
    },
    "./src/shared/api/libraryApi.generated.ts": {
      exportName: "libraryApi",
      filterEndpoints: [/^getLibrary/, /^postLibrary/, /^patchLibrary/, /^deleteLibrary/],
    },
    "./src/shared/api/meApi.generated.ts": {
      exportName: "meApi",
      filterEndpoints: [/^getMe/],
    },
    "./src/shared/api/swipesApi.generated.ts": {
      exportName: "swipesApi",
      filterEndpoints: [/Swipe/],
    },
    "./src/shared/api/discussionsApi.generated.ts": {
      exportName: "discussionsApi",
      filterEndpoints: [/Thread/],
    },
    "./src/shared/api/challengesApi.generated.ts": {
      exportName: "challengesApi",
      filterEndpoints: [/Challenge/],
    },
  },
};

module.exports = config;
