import { configureStore } from "@reduxjs/toolkit";
import { swipeReducer } from "@features/swipe-book/model/swipeSlice";
import { userReducer } from "@features/track-progress/model/userSlice";
import { authReducer } from "@features/auth/model/authSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    swipe: swipeReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Supabase Session contains Date objects
        ignoredActions: ["auth/setSession"],
        ignoredPaths: ["auth.session"],
      },
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
