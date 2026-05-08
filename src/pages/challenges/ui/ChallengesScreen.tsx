import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Trophy, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useListChallengesQuery } from "@shared/api/challengesApi.generated";
import { ChallengeCard } from "@entities/challenge/ui/ChallengeCard";
import { FilterRow } from "@features/filter-list/ui/FilterRow";
import { UserAvatar } from "@features/user-avatar";
import { Screen } from "@shared/ui/Screen";
import { ScreenHeader } from "@shared/ui/ScreenHeader";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";
import type { ListChallengesApiArg } from "@shared/api/challengesApi.generated";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTER_OPTIONS = ["Active", "Monthly", "Yearly", "Weekly", "Custom"] as const;

const LABEL_TO_ARG: Record<string, ListChallengesApiArg> = {
  Active: "active",
  Monthly: "monthly",
  Yearly: "yearly",
  Weekly: "weekly",
  Custom: "custom",
};

export function ChallengesScreen() {
  const navigation = useNavigation<Nav>();
  const [filterLabel, setFilterLabel] = useState<string>(FILTER_OPTIONS[0]);
  const {
    data: challengesData,
    isLoading: challengesLoading,
    isFetching,
    refetch,
  } = useListChallengesQuery(LABEL_TO_ARG[filterLabel]);
  const challenges = challengesData?.data ?? [];

  return (
    <Screen>
      {/* Fixed header */}
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Challenges"
          rightAction={
            <View style={styles.headerActions}>
              <Pressable
                style={styles.createBtn}
                onPress={() => navigation.navigate("CreateChallenge")}
              >
                <Plus size={20} color={colors.accent} />
              </Pressable>
              <Pressable style={styles.trophyBtn}>
                <Trophy size={20} color={colors.badgeGold} />
              </Pressable>
            </View>
          }
          avatar={<UserAvatar size={40} />}
        />
      </View>

      {/* Fixed filter chips */}
      <View style={styles.filterWrap}>
        <FilterRow
          filters={[...FILTER_OPTIONS]}
          initial={FILTER_OPTIONS[0]}
          onChange={setFilterLabel}
        />
      </View>
      <Text style={styles.sectionTitle}>Active Challenges</Text>
      {/* Scrollable challenge list with pull-to-refresh */}
      <FlatList
        style={styles.list}
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={() =>
              navigation.navigate("ChallengeDetail", { challengeId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          challengesLoading ? (
            <ActivityIndicator
              color={colors.accent}
              style={styles.emptySpinner}
            />
          ) : (
            <Text style={styles.emptyText}>
              No active challenges right now.
            </Text>
          )
        }
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  headerWrap: {
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
  },
  trophyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.badgeGoldLight,
    justifyContent: "center",
    alignItems: "center",
  },
  filterWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
    marginBottom: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  emptySpinner: {
    marginTop: 40,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
