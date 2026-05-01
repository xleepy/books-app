import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { booksApi } from "@shared/api/booksApi.generated";

interface SwipeState {
  currentIndex: number;
  totalCards: number;
  swipedBookIds: string[];
}

const initialState: SwipeState = {
  currentIndex: 0,
  totalCards: 0,
  swipedBookIds: [],
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
      state.swipedBookIds = [];
    },
    markSwiped(state, action: PayloadAction<string>) {
      state.swipedBookIds.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      booksApi.endpoints.getBooksFeed.matchFulfilled,
      (state, action) => {
        state.totalCards = action.payload.data.length;
        const ids = action.payload.data.map(
          (b: { id: string }) => b.id,
        );

        let idx = 0;
        while (idx < state.totalCards && state.swipedBookIds.includes(ids[idx])) {
          idx += 1;
        }
        state.currentIndex = idx < state.totalCards ? idx : 0;

        state.swipedBookIds = state.swipedBookIds.filter((id) =>
          ids.includes(id),
        );
      },
    );
  },
});

export const { nextCard, resetDeck, markSwiped } = swipeSlice.actions;
export const swipeReducer = swipeSlice.reducer;
