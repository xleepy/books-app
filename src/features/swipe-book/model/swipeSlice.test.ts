import { swipeReducer, nextCard, resetDeck } from './swipeSlice';

// Use explicit state so tests are independent of the real mockBooks initial state
const state = (currentIndex: number, totalCards: number) => ({ currentIndex, totalCards });

describe('swipeSlice', () => {
  describe('nextCard', () => {
    it('advances currentIndex by 1', () => {
      expect(swipeReducer(state(0, 4), nextCard()).currentIndex).toBe(1);
    });

    it('advances from the middle of the deck', () => {
      expect(swipeReducer(state(2, 4), nextCard()).currentIndex).toBe(3);
    });

    it('wraps back to 0 when at the last card', () => {
      expect(swipeReducer(state(3, 4), nextCard()).currentIndex).toBe(0);
    });

    it('wraps on a single-card deck', () => {
      expect(swipeReducer(state(0, 1), nextCard()).currentIndex).toBe(0);
    });

    it('does not change totalCards', () => {
      const result = swipeReducer(state(1, 4), nextCard());
      expect(result.totalCards).toBe(4);
    });
  });

  describe('resetDeck', () => {
    it('resets currentIndex to 0', () => {
      expect(swipeReducer(state(3, 4), resetDeck()).currentIndex).toBe(0);
    });

    it('is a no-op when already at the first card', () => {
      expect(swipeReducer(state(0, 4), resetDeck()).currentIndex).toBe(0);
    });

    it('does not change totalCards', () => {
      const result = swipeReducer(state(2, 6), resetDeck());
      expect(result.totalCards).toBe(6);
    });
  });

});
