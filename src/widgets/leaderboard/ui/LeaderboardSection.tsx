import { StyleSheet, Text, View } from 'react-native';
import { LeaderboardEntry } from '@entities/challenge/model/types';
import { LeaderboardRow } from '@entities/challenge/ui/LeaderboardRow';
import { colors, fontFamily } from '@shared/theme';

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardSection({ entries }: LeaderboardSectionProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>This Month</Text>
      </View>
      <View style={styles.list}>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.id} entry={entry} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.accent,
  },
  list: {
    gap: 12,
  },
});
