import { Plus, Search } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThreadCard } from '@entities/discussion/ui/ThreadCard';
import { useGetDiscussionsQuery } from '@store/api/discussionsApi.generated';
import { FilterRow } from '@features/filter-list/ui/FilterRow';
import { Screen } from '@pages/_shared/Screen';
import { colors, fontFamily } from '@shared/theme';

export function DiscussionsScreen() {
  const { data, isLoading } = useGetDiscussionsQuery({});
  const threads = data?.data ?? [];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Discussions</Text>
        <Pressable style={styles.addBtn}>
          <Plus size={20} color={colors.fontInverse} />
        </Pressable>
      </View>
      <View style={styles.search}>
        <Search size={18} color={colors.fontTertiary} />
        <TextInput
          placeholder="Search discussions..."
          placeholderTextColor={colors.fontTertiary}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.filterWrap}>
        <FilterRow filters={['All', 'Popular', 'Recent', 'My Threads']} />
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <View style={styles.list}>
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.fontPrimary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  filterWrap: {
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    gap: 12,
  },
});
