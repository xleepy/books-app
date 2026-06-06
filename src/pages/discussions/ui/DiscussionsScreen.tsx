import { useCallback, useState } from "react";
import { Plus, Search } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThreadCard } from "@entities/discussion/ui/ThreadCard";
import {
  useListThreadsQuery,
  ListThreadsApiArg,
} from "@shared/api/discussionsApi.generated";
import { FilterRow } from "@features/filter-list/ui/FilterRow";
import { Screen } from "@shared/ui/Screen";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTER_LABELS = ["All", "Popular", "Recent", "My Threads"] as const;
const FILTER_MAP: Record<string, ListThreadsApiArg["filter"]> = {
  All: "all",
  Popular: "popular",
  Recent: "recent",
  "My Threads": "mine",
};

export function DiscussionsScreen() {
  const navigation = useNavigation<Nav>();
  const [filter, setFilter] = useState<ListThreadsApiArg["filter"]>("recent");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListThreadsQuery({
    filter,
    search: search || undefined,
  });
  const threads = data?.data ?? [];

  const handleFilterChange = useCallback((label: string) => {
    setFilter(FILTER_MAP[label] ?? "all");
  }, []);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Discussions</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate("CreateThread")}
          accessibilityLabel="Create thread"
        >
          <Plus size={20} color={colors.fontInverse} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Search size={18} color={colors.fontTertiary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search discussions..."
          placeholderTextColor={colors.fontTertiary}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterWrap}>
        <FilterRow
          filters={[...FILTER_LABELS]}
          initial="Recent"
          onChange={handleFilterChange}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : threads.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            {search
              ? "No threads match your search."
              : "No threads yet. Be the first to start one!"}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onPress={() =>
                navigation.navigate("ThreadDetail", { threadId: thread.id })
              }
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
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
  emptyWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
  },
});
