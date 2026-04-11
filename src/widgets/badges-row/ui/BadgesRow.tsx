import { StyleSheet, Text, View } from 'react-native';
import { Compass, LucideIcon, Star, Zap } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';

interface Badge {
  icon: LucideIcon;
  label: string;
}

const BADGES: Badge[] = [
  { icon: Star, label: 'Speed Reader' },
  { icon: Zap, label: 'Night Owl' },
  { icon: Compass, label: 'Explorer' },
];

export function BadgesRow() {
  return (
    <View style={styles.row}>
      {BADGES.map(({ icon: Icon, label }) => (
        <View key={label} style={styles.col}>
          <View style={styles.circle}>
            <Icon size={24} color={colors.badgeGold} fill={colors.badgeGold} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
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
});
