import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockBooks } from '@entities/book/mock/books';
import { BookCover } from '@entities/book/ui/BookCover';
import { BookMeta } from '@entities/book/ui/BookMeta';
import { addBook } from '@features/add-to-library/model/librarySlice';
import { AddToLibraryButton } from '@features/add-to-library/ui/AddToLibraryButton';
import { UserAvatar } from '@features/user-avatar';
import { ReviewSection } from '@widgets/review-section/ui/ReviewSection';
import { colors, fontFamily } from '@shared/theme';
import { Separator, StarRating } from '@shared/ui';
import { RootStackParamList } from '@app/navigation/types';

type Route = RouteProp<RootStackParamList, 'BookDetail'>;

export function BookDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const book = mockBooks.find((b) => b.id === route.params.bookId) ?? mockBooks[0];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nav}>
          <Pressable style={styles.navLeft} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={colors.fontPrimary} />
            <Text style={styles.navTitle}>{book.title}</Text>
          </Pressable>
          <UserAvatar size={36} />
        </View>

        <View style={styles.coverWrap}>
          <BookCover cover={book.cover} width={180} height={260} radius={12} />
        </View>

        <View style={styles.info}>
          <BookMeta book={book} align="center" />
          <View style={styles.ratingRow}>
            <StarRating value={book.rating} />
            <Text style={styles.ratingText}>{book.rating.toFixed(1)}/5</Text>
          </View>
        </View>

        <Text style={styles.synopsis}>
          Between life and death there is a library, and within that library, the shelves go on
          forever. Every book provides a chance to try another life you could have lived. To see
          how things would be if you had made other choices... Would you have done anything
          different, if you had the chance to undo your regrets?
        </Text>

        <View style={styles.separatorWrap}>
          <Separator />
        </View>

        <ReviewSection rating={book.rating} reviewCount={book.reviewCount} />
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        <AddToLibraryButton
          onPress={() => {
            dispatch(addBook(book));
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginBottom: 16,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  navTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  coverWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  info: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  synopsis: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.fontSecondary,
    marginBottom: 20,
  },
  separatorWrap: {
    marginBottom: 20,
  },
  cta: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    backgroundColor: colors.bgPrimary,
    paddingTop: 12,
  },
});
