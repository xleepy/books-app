import { createSlice } from "@reduxjs/toolkit";
import { booksApi } from "@shared/api/booksApi.generated";

interface SwipeState {
  currentIndex: number;
  totalCards: number;
}

const initialState: SwipeState = {
  currentIndex: 0,
  totalCards: 0,
};

const swipeSlice = createSlice({
  name: "swipe",
  initialState,
  reducers: {
    nextCard(state) {
      if (state.currentIndex < state.totalCards - 1) {
        state.currentIndex += 1;
      } else {
        state.currentIndex = 0;
      }
    },
    resetDeck(state) {
      state.currentIndex = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      booksApi.endpoints.getBooksFeed.matchFulfilled,
      (state, action) => {
        state.totalCards = action.payload.data.length;
        if (state.currentIndex >= state.totalCards) {
          state.currentIndex = 0;
        }
      },
    );
  },
});

export const { nextCard, resetDeck } = swipeSlice.actions;
export const swipeReducer = swipeSlice.reducer;
