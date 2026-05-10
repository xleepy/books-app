import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Star } from "lucide-react-native";
import { UserAvatar } from "@features/user-avatar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useGetLibraryQuery,
  useGetLibraryStatsQuery,
} from "@shared/api/libraryApi.generated";
import { BookCover } from "@entities/book/ui/BookCover";
import { ReadingCard } from "@widgets/reading-card/ui/ReadingCard";
import { ScreenHeader } from "@shared/ui/ScreenHeader";
import { Screen } from "@shared/ui/Screen";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatTimeLeft(minutes: number | null | undefined): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m left`;
  return `${Math.round(minutes / 60)}h left`;
}

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isFetching } = useGetLibraryQuery({});
  const { data: stats } = useGetLibraryStatsQuery();
  const savedBooks = data?.data ?? [];
  const totalBooks = data?.pagination?.total ?? 0;
  const currentBook = savedBooks.find((b) => b.status === "reading");

  return (
    <Screen scroll>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="My Library"
          subtitle={
            totalBooks ? `${totalBooks} books collected` : "Your collection"
          }
          avatar={<UserAvatar size={40} />}
        />
      </View>

      <View style={styles.statsRow}>
        <StatTile
          value={stats ? String(stats.finished) : "—"}
          label="Finished"
          highlight
        />
        <StatTile value={stats ? String(stats.reading) : "—"} label="Reading" />
        <StatTile value={stats ? String(stats.saved) : "—"} label="Saved" />
      </View>

      {currentBook && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Currently Reading</Text>
            <Pressable
              onPress={() =>
                navigation.navigate("LibraryList", { initialStatus: "reading" })
              }
            >
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <ReadingCard
            title={currentBook.title}
            author={currentBook.author}
            coverUrl={currentBook.coverUrl}
            progress={currentBook.progressPct / 100}
            timeLeft={formatTimeLeft(currentBook.timeLeftMin)}
            onPress={() =>
              navigation.navigate("BookDetail", {
                bookId: currentBook.id,
                libraryStatus: currentBook.status,
              })
            }
          />
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Books</Text>
          <Pressable onPress={() => navigation.navigate("LibraryList", {})}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        {isLoading || (isFetching && savedBooks.length === 0) ? (
          <ActivityIndicator color={colors.accent} />
        ) : savedBooks.length === 0 ? (
          <Text style={styles.emptyText}>No saved books yet</Text>
        ) : (
          <View style={styles.grid}>
            {savedBooks.slice(0, 4).map((book) => (
              <Pressable
                key={book.id}
                style={styles.bookTile}
                onPress={() =>
                  navigation.navigate("BookDetail", {
                    bookId: book.id,
                    libraryStatus: book.status,
                  })
                }
              >
                <BookCover coverUrl={book.coverUrl} height={140} radius={10} />
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.bookRating}>
                  <Star
                    size={12}
                    color={colors.starGold}
                    fill={colors.starGold}
                  />
                  <Text style={styles.ratingText}>{book.rating}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
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
      <Text style={[styles.tileValue, highlight && styles.tileValueLight]}>
        {value}
      </Text>
      <Text style={[styles.tileLabel, highlight && styles.tileLabelLight]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
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
    color: "#FFFFFFCC",
  },
  section: {
    gap: 14,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bookTile: {
    width: "47.5%",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.fontSecondary,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
});
