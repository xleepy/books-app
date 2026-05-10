import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, Users } from "lucide-react-native";
import { useGetFriendsQuery } from "@shared/api/friendsApi.generated";
import { FriendRow } from "@widgets/friend-row/ui/FriendRow";
import { FriendSearchInput } from "@features/friend-search/ui/FriendSearchInput";
import { useRemoveFriendMutation } from "@shared/api/friendsApi.generated";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FriendsListScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useGetFriendsQuery();
  const [removeFriend] = useRemoveFriendMutation();

  const friends = data?.data ?? [];
  const total = data?.total ?? 0;

  const filtered = searchText
    ? friends.filter((f) =>
        f.username.toLowerCase().includes(searchText.toLowerCase()),
      )
    : friends;

  const handleRemove = async (friendshipId: string) => {
    try {
      await removeFriend(friendshipId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color={colors.fontPrimary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>Friends</Text>
        <View style={[styles.headerSide, styles.headerSideRight]} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <FriendSearchInput
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Pending row */}
      <Pressable
        style={styles.pendingRow}
        onPress={() => navigation.navigate("PendingRequests")}
      >
        <Users size={16} color={colors.accent} />
        <View style={styles.pendingRowContent}>
          <Text style={styles.pendingRowText}>Pending Requests</Text>
          <ChevronRight size={16} color={colors.fontTertiary} />
        </View>
      </Pressable>

      {/* Friends list */}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <FriendRow friend={item} onRemove={handleRemove} />
            </View>
          )}
          ListHeaderComponent={
            total > 0 ? (
              <Text style={styles.sectionTitle}>
                My Friends ({filtered.length})
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {searchText
                  ? "No friends match your search."
                  : "Start adding friends to see their reading progress!"}
              </Text>
            </View>
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  searchWrap: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  pendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pendingRowContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingRowText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.fontSecondary,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
  },
});
