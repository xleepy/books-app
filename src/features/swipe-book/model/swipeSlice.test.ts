import { swipeReducer, nextCard, resetDeck } from "./swipeSlice";

// Use explicit state so tests are independent of the real mockBooks initial state
const state = (currentIndex: number, totalCards: number) => ({
  currentIndex,
  totalCards,
});

/** Build a fake getBooksFeed fulfilled action that the extraReducer matcher will accept. */
const feedFulfilled = (dataLength: number) => ({
  type: "api/executeQuery/fulfilled",
  payload: { data: Array(dataLength).fill({ id: "mock" }) },
  meta: {
    requestId: "test-request",
    arg: { endpointName: "getBooksFeed", originalArgs: {} },
    fulfilledTimeStamp: Date.now(),
    baseQueryMeta: undefined,
  },
});

describe("swipeSlice", () => {
  describe("nextCard", () => {
    it("advances currentIndex by 1", () => {
      expect(swipeReducer(state(0, 4), nextCard()).currentIndex).toBe(1);
    });

    it("advances from the middle of the deck", () => {
      expect(swipeReducer(state(2, 4), nextCard()).currentIndex).toBe(3);
    });

    it("wraps back to 0 when at the last card", () => {
      expect(swipeReducer(state(3, 4), nextCard()).currentIndex).toBe(0);
    });

    it("wraps on a single-card deck", () => {
      expect(swipeReducer(state(0, 1), nextCard()).currentIndex).toBe(0);
    });

    it("does not change totalCards", () => {
      const result = swipeReducer(state(1, 4), nextCard());
      expect(result.totalCards).toBe(4);
    });
  });

  describe("resetDeck", () => {
    it("resets currentIndex to 0", () => {
      expect(swipeReducer(state(3, 4), resetDeck()).currentIndex).toBe(0);
    });

    it("is a no-op when already at the first card", () => {
      expect(swipeReducer(state(0, 4), resetDeck()).currentIndex).toBe(0);
    });

    it("does not change totalCards", () => {
      const result = swipeReducer(state(2, 6), resetDeck());
      expect(result.totalCards).toBe(6);
    });
  });

  describe("getBooksFeed.matchFulfilled", () => {
    it("preserves currentIndex when feed refetches with same length", () => {
      // User is on card 3 of 10, feed refetches — should stay on card 3
      const result = swipeReducer(state(3, 10), feedFulfilled(10) as any);
      expect(result.currentIndex).toBe(3);
      expect(result.totalCards).toBe(10);
    });

    it("preserves currentIndex when feed refetches with more cards", () => {
      // User is on card 3 of 10, feed returns 15 cards — should stay on card 3
      const result = swipeReducer(state(3, 10), feedFulfilled(15) as any);
      expect(result.currentIndex).toBe(3);
      expect(result.totalCards).toBe(15);
    });

    it("resets currentIndex to 0 when feed shrinks below current index", () => {
      // User is on card 7 of 10, feed returns only 5 cards — index is out of bounds
      const result = swipeReducer(state(7, 10), feedFulfilled(5) as any);
      expect(result.currentIndex).toBe(0);
      expect(result.totalCards).toBe(5);
    });

    it("resets currentIndex to 0 when feed is empty", () => {
      const result = swipeReducer(state(3, 10), feedFulfilled(0) as any);
      expect(result.currentIndex).toBe(0);
      expect(result.totalCards).toBe(0);
    });

    it("keeps currentIndex at 0 on initial load", () => {
      const result = swipeReducer(state(0, 0), feedFulfilled(10) as any);
      expect(result.currentIndex).toBe(0);
      expect(result.totalCards).toBe(10);
    });

    it("does not reset currentIndex when at the last valid index", () => {
      // User is on card 9 (index 9) of 10, feed returns 10 — should stay
      const result = swipeReducer(state(9, 10), feedFulfilled(10) as any);
      expect(result.currentIndex).toBe(9);
      expect(result.totalCards).toBe(10);
    });
  });
});
