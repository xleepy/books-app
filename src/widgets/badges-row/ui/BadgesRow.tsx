import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  Award,
  BookOpen,
  Compass,
  Flame,
  LucideIcon,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
} from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { UserBadge } from '@shared/api/meApi.generated';

// Map badge slugs to a Lucide icon — falls back to Award for unrecognised slugs
const BADGE_ICONS: Record<string, LucideIcon> = {
  'first-chapter': BookOpen,
  'on-fire': Flame,
  critic: Star,
  centurion: Trophy,
  champion: ShieldCheck,
  // legacy / extra
  'speed-reader': Zap,
  'night-owl': Zap,
  explorer: Compass,
};

interface BadgesRowProps {
  badges: UserBadge[];
  isLoading?: boolean;
}

export function BadgesRow({ badges, isLoading }: BadgesRowProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!badges.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No badges earned yet — keep reading!</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {badges.map((badge) => {
        const Icon = BADGE_ICONS[badge.slug] ?? Award;
        return (
          <View key={badge.slug} style={styles.col}>
            <View style={styles.circle}>
              <Icon size={24} color={colors.badgeGold} fill={colors.badgeGold} />
            </View>
            <Text style={styles.label} numberOfLines={2}>{badge.name}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  col: {
    width: 72,
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.badgeGoldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontSecondary,
    textAlign: 'center',
  },
  loadingWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingVertical: 12,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontSecondary,
  },
});
