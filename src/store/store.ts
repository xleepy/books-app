import { configureStore } from '@reduxjs/toolkit';
import { swipeReducer } from '@features/swipe-book/model/swipeSlice';
import { userReducer } from '@features/track-progress/model/userSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    swipe: swipeReducer,
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
