import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetLibraryQuery } from '@store/api/libraryApi.generated';
import type { LibraryBook } from '@store/api/libraryApi.generated';
import { BookCover } from '@entities/book/ui/BookCover';
import { colors, fontFamily } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'LibraryList'>;

type StatusFilter = 'all' | 'want' | 'reading' | 'finished';

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reading', label: 'Reading' },
  { key: 'want', label: 'Saved' },
  { key: 'finished', label: 'Finished' },
];

const STATUS_LABEL: Record<string, string> = {
  want: 'Saved',
  reading: 'Reading',
  finished: 'Finished',
};

const STATUS_COLOR: Record<string, string> = {
  want: colors.accentLight,
  reading: colors.challengeBlueLight,
  finished: colors.accentGreen + '22',
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  want: colors.accent,
  reading: colors.challengeBlue,
  finished: colors.accentGreen,
};

export function LibraryListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<StatusFilter>(
    route.params?.initialStatus ?? 'all',
  );

  const { data, isLoading } = useGetLibraryQuery(
    activeTab === 'all' ? {} : { status: activeTab },
  );

  const books = data?.data ?? [];

  const renderBook = useCallback(
    ({ item }: { item: LibraryBook }) => (
      <Pressable
        style={styles.row}
        onPress={() =>
          navigation.navigate('BookDetail', {
            bookId: item.id,
            libraryStatus: item.status,
          })
        }
      >
        <BookCover coverUrl={item.coverUrl} width={56} height={80} radius={8} />
        <View style={styles.rowInfo}>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.rowAuthor} numberOfLines={1}>
            {item.author}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: STATUS_COLOR[item.status] ?? colors.bgSecondary },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: STATUS_TEXT_COLOR[item.status] ?? colors.fontSecondary },
              ]}
            >
              {STATUS_LABEL[item.status] ?? item.status}
            </Text>
          </View>
        </View>
        {item.status === 'reading' && item.progressPct > 0 && (
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { height: (item.progressPct / 100) * 48 },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(item.progressPct)}%</Text>
          </View>
        )}
      </Pressable>
    ),
    [navigation],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>My Library</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : books.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No books here yet</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderBook}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 24 },
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  tabLabelActive: {
    color: colors.fontInverse,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.fontSecondary,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  rowAuthor: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeText: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  progressWrap: {
    alignItems: 'center',
    gap: 4,
  },
  progressTrack: {
    width: 4,
    height: 48,
    borderRadius: 2,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  progressFill: {
    width: '100%',
    backgroundColor: colors.challengeBlue,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    color: colors.fontTertiary,
  },
});
