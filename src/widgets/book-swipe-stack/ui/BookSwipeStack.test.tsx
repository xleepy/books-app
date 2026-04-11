import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookSwipeStack } from './BookSwipeStack';
import { libraryReducer } from '@features/add-to-library/model/librarySlice';
import { swipeReducer } from '@features/swipe-book/model/swipeSlice';
import { mockBooks } from '@entities/book/mock/books';

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
    reducer: { library: libraryReducer, swipe: swipeReducer },
  });
}

// SwipeActions renders 3 ActionButtons: [0] pass, [1] bookmark, [2] like
function getActionButtons(screen: ReturnType<typeof render>) {
  return screen.queryAllByRole('button');
}

describe('BookSwipeStack', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={makeStore()}>
        <BookSwipeStack />
      </Provider>,
    );
  });

  describe('pass button', () => {
    it('advances to the next card', () => {
      const store = makeStore();
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(getActionButtons(screen)[0]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });

    it('does not add the book to the library', () => {
      const store = makeStore();
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const currentBook = mockBooks[store.getState().swipe.currentIndex];
      const before = store.getState().library.savedBooks.length;
      fireEvent.press(getActionButtons(screen)[0]);
      expect(store.getState().library.savedBooks.length).toBe(before);
      expect(store.getState().library.savedBooks.some((b) => b.id === currentBook.id)).toBe(false);
    });
  });

  describe('like button', () => {
    it('adds the current book to the library', () => {
      const store = makeStore();
      // currentIndex starts at 0; mockBooks[0] is not in the seeded library
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const currentBook = mockBooks[0];
      expect(store.getState().library.savedBooks.some((b) => b.id === currentBook.id)).toBe(false);
      fireEvent.press(getActionButtons(screen)[2]);
      expect(store.getState().library.savedBooks.some((b) => b.id === currentBook.id)).toBe(true);
    });

    it('advances to the next card', () => {
      const store = makeStore();
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(getActionButtons(screen)[2]);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });

    it('does not add duplicates when liking the same book twice', () => {
      const store = makeStore();
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      fireEvent.press(getActionButtons(screen)[2]); // like book at index 0

      // Reset deck so we're back at the same book
      const { resetDeck } = require('@features/swipe-book/model/swipeSlice');
      act(() => { store.dispatch(resetDeck()); });

      // Re-render so component reflects new state
      screen.rerender(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const countBefore = store.getState().library.savedBooks.length;
      fireEvent.press(getActionButtons(screen)[2]); // like the same book again
      expect(store.getState().library.savedBooks.length).toBe(countBefore);
    });
  });

  describe('bookmark button', () => {
    it('saves the book and advances the deck', () => {
      const store = makeStore();
      const screen = render(
        <Provider store={store}>
          <BookSwipeStack />
        </Provider>,
      );
      const currentBook = mockBooks[0];
      const before = store.getState().swipe.currentIndex;
      fireEvent.press(getActionButtons(screen)[1]);
      expect(store.getState().library.savedBooks.some((b) => b.id === currentBook.id)).toBe(true);
      expect(store.getState().swipe.currentIndex).toBe(before + 1);
    });
  });
});
