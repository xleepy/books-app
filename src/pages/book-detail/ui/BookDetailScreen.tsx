import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetBooksByIdQuery } from '@shared/api/booksApi.generated';
import {
  useGetLibraryQuery,
  usePostLibraryMutation,
  usePatchLibraryByBookIdMutation,
  useDeleteLibraryByBookIdMutation,
} from '@shared/api/libraryApi.generated';
import { BookCover } from '@entities/book/ui/BookCover';
import { BookMeta } from '@entities/book/ui/BookMeta';
import { AddToLibraryButton } from '@features/add-to-library/ui/AddToLibraryButton';
import { ReadingProgressForm } from '@features/reading-progress';
import { UserAvatar } from '@features/user-avatar';
import { ReviewSection } from '@widgets/review-section/ui/ReviewSection';
import { colors, fontFamily } from '@shared/theme';
import { Separator, StarRating } from '@shared/ui';
import { RootStackParamList } from '@app/navigation/types';

type Route = RouteProp<RootStackParamList, 'BookDetail'>;

export function BookDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const { bookId, libraryStatus: initialLibraryStatus } = route.params;
  const [libraryStatus, setLibraryStatus] = useState(initialLibraryStatus);

  const { data: book, isLoading } = useGetBooksByIdQuery(bookId);
  const { data: libraryData } = useGetLibraryQuery({});
  const [addToLibrary, { isLoading: isAdding }] = usePostLibraryMutation();
  const [patchLibrary, { isLoading: isPatching }] = usePatchLibraryByBookIdMutation();
  const [deleteFromLibrary, { isLoading: isDeleting }] = useDeleteLibraryByBookIdMutation();

  const libraryItem = libraryData?.data.find((b) => b.id === bookId);
  const pageCount = book?.pageCount ?? libraryItem?.pageCount ?? 300;
  const initialPage = libraryItem?.currentPage ?? 0;

  async function handleMarkStatus(status: 'reading' | 'finished') {
    try {
      await patchLibrary({
        bookId,
        body: { status },
      }).unwrap();
      setLibraryStatus(status);
    } catch {
      Alert.alert('Error', 'Failed to update reading status. Please try again.');
    }
  }

  function handleRemove() {
    Alert.alert('Remove from library', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFromLibrary(bookId).unwrap();
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Failed to remove book. Please try again.');
          }
        },
      },
    ]);
  }

  if (isLoading || !book) {
    return (
      <View style={[styles.root, styles.centered]}>
        {isLoading ? (
          <ActivityIndicator color={colors.accent} size="large" />
        ) : (
          <Text style={styles.errorText}>Book not found</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 120,
          gap: 16,
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
          <BookCover coverUrl={book.coverUrl} width={180} height={260} radius={12} />
        </View>

        <View style={styles.info}>
          <BookMeta book={book} align="center" />
          <View style={styles.ratingRow}>
            <StarRating value={book.rating} />
            <Text style={styles.ratingText}>{book.rating.toFixed(1)}/5</Text>
          </View>
        </View>

        {libraryStatus === 'reading' && (
          <ReadingProgressForm
            bookId={bookId}
            title={book.title}
            coverUrl={book.coverUrl}
            pageCount={pageCount}
            initialPage={initialPage}
            onUpdated={(status) => setLibraryStatus(status)}
          />
        )}

        <Text style={styles.synopsis}>{book.description}</Text>

        <View style={styles.separatorWrap}>
          <Separator />
        </View>

        <ReviewSection bookId={book.id} rating={book.rating} reviewCount={book.reviewCount} />
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: insets.bottom + 12 }]}>
        {libraryStatus ? (
          <View style={styles.libraryActions}>
            <Pressable style={styles.removeBtn} onPress={handleRemove} disabled={isDeleting}>
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.accentRed} />
              ) : (
                <Trash2 size={18} color={colors.accentRed} />
              )}
            </Pressable>
            <Pressable
              style={[
                styles.statusBtn,
                libraryStatus === 'reading' && styles.statusBtnActive,
              ]}
              onPress={() => handleMarkStatus('reading')}
              disabled={isPatching || libraryStatus === 'reading'}
            >
              {isPatching && libraryStatus !== 'reading' ? (
                <ActivityIndicator size="small" color={colors.fontSecondary} />
              ) : (
                <Text
                  style={[
                    styles.statusBtnText,
                    libraryStatus === 'reading' && styles.statusBtnTextActive,
                  ]}
                >
                  Reading
                </Text>
              )}
            </Pressable>
            <Pressable
              style={[
                styles.statusBtn,
                libraryStatus === 'finished' && styles.statusBtnActive,
              ]}
              onPress={() => handleMarkStatus('finished')}
              disabled={isPatching || libraryStatus === 'finished'}
            >
              {isPatching && libraryStatus !== 'finished' ? (
                <ActivityIndicator size="small" color={colors.fontSecondary} />
              ) : (
                <Text
                  style={[
                    styles.statusBtnText,
                    libraryStatus === 'finished' && styles.statusBtnTextActive,
                  ]}
                >
                  Finished
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          <AddToLibraryButton
            onPress={async () => {
              try {
                await addToLibrary({ bookId: book.id, status: 'want' }).unwrap();
                navigation.goBack();
              } catch {
                Alert.alert('Error', 'Failed to add book to library. Please try again.');
              }
            }}
            isLoading={isAdding}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontSecondary,
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
  libraryActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  removeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.accentRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSecondary,
  },
  statusBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  statusBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontSecondary,
  },
  statusBtnTextActive: {
    color: colors.fontInverse,
  },
});
