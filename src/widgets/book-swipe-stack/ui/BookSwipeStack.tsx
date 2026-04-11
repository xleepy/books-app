import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from '@entities/book/model/types';
import { mockBooks } from '@entities/book/mock/books';
import { BookCover } from '@entities/book/ui/BookCover';
import { BookMeta } from '@entities/book/ui/BookMeta';
import { addBook } from '@features/add-to-library/model/librarySlice';
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

  const currentBook = mockBooks[currentIndex];
  const nextBook = mockBooks[(currentIndex + 1) % mockBooks.length];

  const handlePass = useCallback(() => {
    dispatch(nextCard());
  }, [dispatch]);

  const handleBookmark = useCallback(() => {
    dispatch(addBook(currentBook));
    dispatch(nextCard());
  }, [dispatch, currentBook]);

  const handleLike = useCallback(() => {
    dispatch(addBook(currentBook));
    onLike?.(currentBook);
    dispatch(nextCard());
  }, [dispatch, currentBook, onLike]);

  return (
    <View style={styles.wrap}>
      <View style={styles.cardArea}>
        <View style={[styles.cardContainer, styles.behind]}>
          <BookCardContent book={nextBook} />
        </View>
        <View style={styles.cardContainer}>
          <SwipeableCard onSwipeLeft={handlePass} onSwipeRight={handleLike} onTap={() => onCardTap?.(currentBook)}>
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
      <BookCover cover={book.cover} height={260} radius={0} shadow={false} />
      <View style={styles.cardBody}>
        <BookMeta book={book} />
        <Text style={styles.description}>{book.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
