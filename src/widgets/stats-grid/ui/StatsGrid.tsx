import { StyleSheet, Text, View } from 'react-native';
import { BookOpen, CheckCircle2, Clock3, LucideIcon, TrendingUp } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { ReadingStats } from '@entities/user/model/types';

interface StatsGridProps {
  stats: ReadingStats;
}

interface StatBox {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items: StatBox[] = [
    { icon: BookOpen, value: stats.pagesRead.toLocaleString(), label: 'Pages Read' },
    { icon: CheckCircle2, value: String(stats.booksFinished), label: 'Books Finished' },
    { icon: TrendingUp, value: `${stats.dailyAverage} pages`, label: 'Daily Average' },
    { icon: Clock3, value: `${stats.hoursRead} hrs`, label: 'Reading Time' },
  ];

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <StatTile box={items[0]} />
        <StatTile box={items[1]} />
      </View>
      <View style={styles.row}>
        <StatTile box={items[2]} />
        <StatTile box={items[3]} />
      </View>
    </View>
  );
}

function StatTile({ box }: { box: StatBox }) {
  const Icon = box.icon;
  return (
    <View style={styles.tile}>
      <Icon size={20} color={colors.accent} />
      <Text style={styles.value}>{box.value}</Text>
      <Text style={styles.label}>{box.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  value: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.fontPrimary,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
});
