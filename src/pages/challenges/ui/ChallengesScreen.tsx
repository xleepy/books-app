import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { mockChallenges, mockLeaderboard } from '@entities/challenge/mock/challenges';
import { ChallengeCard } from '@entities/challenge/ui/ChallengeCard';
import { FilterRow } from '@features/filter-list/ui/FilterRow';
import { LeaderboardSection } from '@widgets/leaderboard/ui/LeaderboardSection';
import { Screen } from '@pages/_shared/Screen';
import { colors, fontFamily } from '@shared/theme';
import { Avatar } from '@shared/ui';

export function ChallengesScreen() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <View style={styles.right}>
          <Pressable style={styles.trophyBtn}>
            <Trophy size={20} color={colors.badgeGold} />
          </Pressable>
          <Avatar initials="JD" size={40} hue={120} />
        </View>
      </View>

      <View style={styles.filterWrap}>
        <FilterRow filters={['Active', 'Monthly', 'Yearly', 'Leaderboard']} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Challenges</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>
        <View style={styles.list}>
          {mockChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </View>
      </View>

      <LeaderboardSection entries={mockLeaderboard} />
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
