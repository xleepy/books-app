import { swipeReducer, nextCard, resetDeck, markSwiped } from "./swipeSlice";

const state = (
  currentIndex: number,
  totalCards: number,
  swipedBookIds: string[] = [],
) => ({ currentIndex, totalCards, swipedBookIds });

/** Build a fake getBooksFeed fulfilled action with specific book IDs. */
const feedFulfilled = (ids: string[]) => ({
  type: "api/executeQuery/fulfilled",
  payload: { data: ids.map((id) => ({ id })) },
  meta: {
    requestId: "test-request",
    arg: { endpointName: "getBooksFeed", originalArgs: {} },
    fulfilledTimeStamp: Date.now(),
    baseQueryMeta: undefined,
  },
});

/** Convenience: feed with `count` anonymous books (all id = "mock"). */
const feedWithCount = (count: number) =>
  feedFulfilled(Array(count).fill("mock"));

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

    it("does not change swipedBookIds", () => {
      const result = swipeReducer(state(1, 4, ["A", "B"]), nextCard());
      expect(result.swipedBookIds).toEqual(["A", "B"]);
    });
  });

  describe("markSwiped", () => {
    it("adds the book ID to swipedBookIds", () => {
      const result = swipeReducer(
        state(0, 4, ["A"]),
        markSwiped("B"),
      );
      expect(result.swipedBookIds).toEqual(["A", "B"]);
    });

    it("does not change currentIndex or totalCards", () => {
      const result = swipeReducer(state(2, 4, []), markSwiped("X"));
      expect(result.currentIndex).toBe(2);
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

    it("clears swipedBookIds", () => {
      const result = swipeReducer(state(0, 4, ["A", "B"]), resetDeck());
      expect(result.swipedBookIds).toEqual([]);
    });
  });

  describe("getBooksFeed.matchFulfilled", () => {
    it("resets currentIndex to 0 when no swiped books are tracked", () => {
      const result = swipeReducer(state(3, 10), feedWithCount(10) as any);
      expect(result.currentIndex).toBe(0);
      expect(result.totalCards).toBe(10);
    });

    it("resets currentIndex to 0 when feed refetches with more cards", () => {
      const result = swipeReducer(state(3, 10), feedWithCount(15) as any);
      expect(result.currentIndex).toBe(0);
    });

    it("resets currentIndex to 0 when feed shrinks below current index", () => {
      const result = swipeReducer(state(7, 10), feedWithCount(5) as any);
      expect(result.currentIndex).toBe(0);
    });

    it("resets currentIndex to 0 when feed is empty", () => {
      const result = swipeReducer(state(3, 10), feedFulfilled([]) as any);
      expect(result.currentIndex).toBe(0);
      expect(result.totalCards).toBe(0);
    });

    it("keeps currentIndex at 0 on initial load", () => {
      const result = swipeReducer(state(0, 0), feedWithCount(10) as any);
      expect(result.currentIndex).toBe(0);
    });

    it("skips past a swiped book that is still in the feed", () => {
      // User swiped "A", feed refetches with [A, B, C] — A should be skipped
      const result = swipeReducer(
        state(0, 3, ["A"]),
        feedFulfilled(["A", "B", "C"]) as any,
      );
      expect(result.currentIndex).toBe(1);
      expect(result.totalCards).toBe(3);
    });

    it("skips past multiple swiped books still in the feed", () => {
      // User swiped A and B rapidly, first refetch only removes A
      const result = swipeReducer(
        state(1, 4, ["A", "B"]),
        feedFulfilled(["B", "C", "D"]) as any,
      );
      expect(result.currentIndex).toBe(1); // skipped B → lands on C
      // A cleaned up (no longer in feed), B kept (still in feed)
      expect(result.swipedBookIds).toEqual(["B"]);
    });

    it("cleans up swiped books that have been removed from the feed", () => {
      const result = swipeReducer(
        state(0, 4, ["A", "B"]),
        feedFulfilled(["C", "D"]) as any,
      );
      expect(result.currentIndex).toBe(0);
      expect(result.swipedBookIds).toEqual([]);
    });

    it("falls back to index 0 when all books are swiped", () => {
      const result = swipeReducer(
        state(0, 3, ["A", "B", "C"]),
        feedFulfilled(["A", "B", "C"]) as any,
      );
      expect(result.currentIndex).toBe(0);
    });
  });
});
