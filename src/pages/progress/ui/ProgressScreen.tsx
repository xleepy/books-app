import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LevelCard } from '@widgets/level-card/ui/LevelCard';
import { StreakCard } from '@widgets/streak-card/ui/StreakCard';
import { StatsGrid } from '@widgets/stats-grid/ui/StatsGrid';
import { BadgesRow } from '@widgets/badges-row/ui/BadgesRow';
import { ScreenHeader } from '@pages/_shared/ScreenHeader';
import { Screen } from '@pages/_shared/Screen';
import { colors, fontFamily } from '@shared/theme';
import { RootState } from '@store/store';

export function ProgressScreen() {
  const user = useSelector((state: RootState) => state.user.user);
  const stats = useSelector((state: RootState) => state.user.stats);

  return (
    <Screen scroll>
      <View style={styles.headerWrap}>
        <ScreenHeader title="My Progress" hue={280} />
      </View>
      <View style={styles.section}>
        <LevelCard user={user} />
      </View>
      <View style={styles.section}>
        <StreakCard
          streak={stats.streak}
          bestStreak={stats.bestStreak}
          weekDays={stats.weekDays}
        />
      </View>
      <View style={styles.section}>
        <StatsGrid stats={stats} />
      </View>
      <View style={styles.badgesHeader}>
        <Text style={styles.badgesTitle}>Recent Badges</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <BadgesRow />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  seeAll: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.accent,
  },
});
