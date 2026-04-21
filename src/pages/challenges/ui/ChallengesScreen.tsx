import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { useGetChallengesQuery } from '@shared/api/challengesApi.generated';
import { useGetChallengesByIdLeaderboardQuery } from '@shared/api/challengesApi.generated';
import { ChallengeCard } from '@entities/challenge/ui/ChallengeCard';
import { FilterRow } from '@features/filter-list/ui/FilterRow';
import { LeaderboardSection } from '@widgets/leaderboard/ui/LeaderboardSection';
import { Screen } from '@shared/ui/Screen';
import { ScreenHeader } from '@shared/ui/ScreenHeader';
import { colors, fontFamily } from '@shared/theme';

export function ChallengesScreen() {
  const { data: challengesData, isLoading: challengesLoading } = useGetChallengesQuery({});
  const challenges = challengesData?.data ?? [];
  const firstChallengeId = challenges[0]?.id;

  const { data: leaderboardData } = useGetChallengesByIdLeaderboardQuery(
    { id: firstChallengeId! },
    { skip: !firstChallengeId }
  );
  const leaderboard = leaderboardData?.data ?? [];

  return (
    <Screen scroll>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Challenges"
          rightAction={
            <Pressable style={styles.trophyBtn}>
              <Trophy size={20} color={colors.badgeGold} />
            </Pressable>
          }
        />
      </View>

      <View style={styles.filterWrap}>
        <FilterRow filters={['Active', 'Monthly', 'Yearly', 'Leaderboard']} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        {challengesLoading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <View style={styles.list}>
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </View>
        )}
      </View>

      <LeaderboardSection entries={leaderboard} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 20,
  },
  trophyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.badgeGoldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterWrap: {
    marginBottom: 20,
  },
  section: {
    gap: 12,
    marginBottom: 20,
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
  list: {
    gap: 12,
  },
});
