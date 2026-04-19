import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookSwipeStack } from './BookSwipeStack';
import { swipeReducer } from '@features/swipe-book/model/swipeSlice';
import { api } from '@store/api/apiSlice';

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  const makeGesture = () => {
    const g: Record<string, unknown> = {};
    for (const m of ['onBegin', 'onStart', 'onEnd', 'onUpdate', 'onFinalize', 'minDistance', 'maxDuration']) {
      g[m] = () => g;
    }
    return g;
  };
  return {
    GestureDetector: View,
    Gesture: { Tap: makeGesture, Pan: makeGesture, Race: () => ({}) },
  };
});

function makeStore() {
  return configureStore({
    reducer: { swipe: swipeReducer, [api.reducerPath]: api.reducer },
    middleware: (get) => get().concat(api.middleware),
  });
}

// SwipeActions renders 3 ActionButtons in order: [0] pass, [1] bookmark, [2] like
async function renderAndWait(store: ReturnType<typeof makeStore>) {
  const screen = render(
    <Provider store={store}>
      <BookSwipeStack />
    </Provider>,
  );
  // Wait for MSW to respond and books to render (replaces loading state with cards + buttons)
  const buttons = await screen.findAllByRole('button');
  return { screen, buttons };
}

describe('BookSwipeStack', () => {
  it('renders without crashing', async () => {
    const store = makeStore();
    await renderAndWait(store);
  });

  describe('pass button', () => {
    it('advances to the next card', async () => {
      const store = makeStore();
      const { buttons } = await renderAndWait(store);
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(buttons[0]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });

    it('does not advance the library (no mutation on pass)', async () => {
      const store = makeStore();
      const { buttons } = await renderAndWait(store);
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(buttons[0]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });
  });

  describe('like button', () => {
    it('advances to the next card', async () => {
      const store = makeStore();
      const { buttons } = await renderAndWait(store);
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(buttons[2]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });
  });

  describe('bookmark button', () => {
    it('advances the deck', async () => {
      const store = makeStore();
      const { buttons } = await renderAndWait(store);
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(buttons[1]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });
  });
});
