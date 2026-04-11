import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SwipeState {
  currentIndex: number;
  totalCards: number;
}

const initialState: SwipeState = {
  currentIndex: 0,
  totalCards: 0,
};

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {
    setTotalCards(state, action: PayloadAction<number>) {
      state.totalCards = action.payload;
    },
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
});

export const { nextCard, resetDeck, setTotalCards } = swipeSlice.actions;
export const swipeReducer = swipeSlice.reducer;
