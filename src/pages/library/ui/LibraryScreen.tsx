import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { mockBooks } from '@entities/book/mock/books';
import { BookCover } from '@entities/book/ui/BookCover';
import { ReadingCard } from '@widgets/reading-card/ui/ReadingCard';
import { ScreenHeader } from '@pages/_shared/ScreenHeader';
import { Screen } from '@pages/_shared/Screen';
import { colors, fontFamily } from '@shared/theme';
import { RootState } from '@store/store';

export function LibraryScreen() {
  const savedBooks = useSelector((state: RootState) => state.library.savedBooks);
  const totalBooks = savedBooks.length + 11 + 12;

  return (
    <Screen scroll>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="My Library"
          subtitle={`${totalBooks} books collected`}
        />
      </View>

      <View style={styles.statsRow}>
        <StatTile value="12" label="Finished" highlight />
        <StatTile value="3" label="Reading" />
        <StatTile value={String(savedBooks.length)} label="Wishlist" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Currently Reading</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <ReadingCard
          cover="cover3"
          title="Atomic Habits"
          author="James Clear"
          progress={0.68}
          timeLeft="4h left"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Books</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <View style={styles.grid}>
          {(savedBooks.length ? savedBooks : mockBooks).slice(0, 4).map((book) => (
            <View key={book.id} style={styles.bookTile}>
              <BookCover cover={book.cover} height={140} radius={10} />
              <Text style={styles.bookTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.bookRating}>
                <Star size={12} color={colors.starGold} fill={colors.starGold} />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function StatTile({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.tile, highlight && styles.tileHighlight]}>
      <Text style={[styles.tileValue, highlight && styles.tileValueLight]}>{value}</Text>
      <Text style={[styles.tileLabel, highlight && styles.tileLabelLight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  tileHighlight: {
    backgroundColor: colors.accent,
  },
  tileValue: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.fontPrimary,
  },
  tileValueLight: {
    color: colors.fontInverse,
  },
  tileLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  tileLabelLight: {
    color: '#FFFFFFCC',
  },
  section: {
    gap: 14,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  seeAll: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.accent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookTile: {
    width: '47.5%',
    gap: 6,
  },
  bookTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontPrimary,
    marginTop: 4,
  },
  bookAuthor: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontSecondary,
  },
  bookRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.fontSecondary,
  },
});
