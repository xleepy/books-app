import { useCallback, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Book, useGetBooksFeedQuery } from "@shared/api/booksApi.generated";
import { usePostLibraryMutation } from "@shared/api/libraryApi.generated";
import { usePostSwipesMutation } from "@shared/api/swipesApi.generated";
import { BookCover } from "@entities/book/ui/BookCover";
import { BookMeta } from "@entities/book/ui/BookMeta";
import { markSwiped, nextCard } from "@features/swipe-book/model/swipeSlice";
import { SwipeableCard } from "@features/swipe-book/ui/SwipeableCard";
import { SwipeActions } from "@features/swipe-book/ui/SwipeActions";
import { colors, fontFamily } from "@shared/theme";
import { RootState } from "@store/store";

interface BookSwipeStackProps {
  onCardTap?: (book: Book) => void;
}

function resolveIndex(
  books: Book[],
  desiredId: string | null,
  fallbackIndex: number,
) {
  if (desiredId && books.length > 0) {
    const idx = books.findIndex((b) => b.id === desiredId);
    if (idx >= 0) return idx;
  }
  return fallbackIndex < books.length ? fallbackIndex : 0;
}

export function BookSwipeStack({ onCardTap }: BookSwipeStackProps) {
  const dispatch = useDispatch();
  const currentIndex = useSelector(
    (state: RootState) => state.swipe.currentIndex,
  );
  const { data, isLoading } = useGetBooksFeedQuery({});
  const [addToLibrary] = usePostLibraryMutation();
  const [recordSwipe] = usePostSwipesMutation();
  const books = useMemo(() => data?.data ?? [], [data]);

  const desiredBookIdRef = useRef<string | null>(null);

  const displayIndex = useMemo(
    () => resolveIndex(books, desiredBookIdRef.current, currentIndex),
    [books, currentIndex],
  );

  const currentBook = books[displayIndex];
  const nextBook = books[(displayIndex + 1) % Math.max(books.length, 1)];

  useEffect(() => {
    books.slice(displayIndex + 1, displayIndex + 4).forEach((book) => {
      if (book.coverUrl) Image.prefetch(book.coverUrl);
    });
  }, [displayIndex, books]);

  const handlePass = useCallback(async () => {
    if (!currentBook || books.length === 0) return;
    const idx = books.findIndex((b) => b.id === currentBook.id);
    const nextIdx = (idx + 1) % books.length;
    desiredBookIdRef.current = books[nextIdx]?.id ?? null;
    dispatch(markSwiped(currentBook.id));
    dispatch(nextCard());
    try {
      await recordSwipe({ bookId: currentBook.id, direction: "left" }).unwrap();
    } catch {}
  }, [dispatch, currentBook, books, recordSwipe]);

  const handleBookmark = useCallback(async () => {
    if (!currentBook || books.length === 0) return;
    const idx = books.findIndex((b) => b.id === currentBook.id);
    const nextIdx = (idx + 1) % books.length;
    desiredBookIdRef.current = books[nextIdx]?.id ?? null;
    dispatch(markSwiped(currentBook.id));
    dispatch(nextCard());
    try {
      await addToLibrary({ bookId: currentBook.id, status: "want" }).unwrap();
    } catch {}
  }, [addToLibrary, dispatch, currentBook, books]);

  const handleLike = useCallback(async () => {
    if (!currentBook || books.length === 0) return;
    const idx = books.findIndex((b) => b.id === currentBook.id);
    const nextIdx = (idx + 1) % books.length;
    desiredBookIdRef.current = books[nextIdx]?.id ?? null;
    dispatch(markSwiped(currentBook.id));
    dispatch(nextCard());
    try {
      await addToLibrary({ bookId: currentBook.id, status: "want" }).unwrap();
    } catch {}
  }, [addToLibrary, dispatch, currentBook, books]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!currentBook) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No books to discover</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.cardArea}>
        {nextBook && (
          <View style={[styles.cardContainer, styles.behind]}>
            <BookCardContent book={nextBook} />
          </View>
        )}
        <View style={styles.cardContainer}>
          <SwipeableCard
            onSwipeLeft={handlePass}
            onSwipeRight={handleLike}
            onTap={() => onCardTap?.(currentBook)}
          >
            <BookCardContent book={currentBook} />
          </SwipeableCard>
        </View>
      </View>
      <SwipeActions
        onPass={handlePass}
        onBookmark={handleBookmark}
        onLike={handleLike}
      />
    </View>
  );
}

function BookCardContent({ book }: { book: Book }) {
  return (
    <View style={styles.card}>
      <BookCover
        coverUrl={book.coverUrl}
        height={260}
        radius={0}
        shadow={false}
        resizeMode="contain"
      />
      <View style={styles.cardBody}>
        <BookMeta book={book} />
        <Text style={styles.description}>{book.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontSecondary,
  },
  wrap: {
    flex: 1,
    gap: 20,
  },
  cardArea: {
    flex: 1,
    minHeight: 460,
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  behind: {
    transform: [{ scale: 0.95 }, { translateY: 12 }],
    opacity: 0.5,
  },
  card: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: "#1A161418",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
  },
  cardBody: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.fontSecondary,
  },
});
