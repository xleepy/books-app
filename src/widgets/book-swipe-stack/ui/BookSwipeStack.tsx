import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from '@store/api/booksApi.generated';
import { useGetBooksQuery } from '@store/api/booksApi.generated';
import { usePostLibraryByBookIdMutation } from '@store/api/libraryApi.generated';
import { BookCover } from '@entities/book/ui/BookCover';
import { BookMeta } from '@entities/book/ui/BookMeta';
import { nextCard } from '@features/swipe-book/model/swipeSlice';
import { SwipeableCard } from '@features/swipe-book/ui/SwipeableCard';
import { SwipeActions } from '@features/swipe-book/ui/SwipeActions';
import { colors, fontFamily } from '@shared/theme';
import { RootState } from '@store/store';

interface BookSwipeStackProps {
  onLike?: (book: Book) => void;
  onCardTap?: (book: Book) => void;
}

export function BookSwipeStack({ onLike, onCardTap }: BookSwipeStackProps) {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state: RootState) => state.swipe.currentIndex);
  const { data, isLoading } = useGetBooksQuery({});
  const [addToLibrary] = usePostLibraryByBookIdMutation();
  const books = data?.data ?? [];

  const currentBook = books[currentIndex];
  const nextBook = books[(currentIndex + 1) % Math.max(books.length, 1)];

  const handlePass = useCallback(() => dispatch(nextCard()), [dispatch]);

  const handleBookmark = useCallback(() => {
    if (!currentBook) return;
    addToLibrary({ bookId: currentBook.id });
    dispatch(nextCard());
  }, [addToLibrary, dispatch, currentBook]);

  const handleLike = useCallback(() => {
    if (!currentBook) return;
    addToLibrary({ bookId: currentBook.id });
    onLike?.(currentBook);
    dispatch(nextCard());
  }, [addToLibrary, dispatch, currentBook, onLike]);

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
      <SwipeActions onPass={handlePass} onBookmark={handleBookmark} onLike={handleLike} />
    </View>
  );
}

function BookCardContent({ book }: { book: Book }) {
  return (
    <View style={styles.card}>
      <BookCover coverUrl={book.coverUrl} height={260} radius={0} shadow={false} />
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
    justifyContent: 'center',
    alignItems: 'center',
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#1A161418',
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
