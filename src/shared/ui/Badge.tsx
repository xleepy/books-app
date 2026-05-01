import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';

interface BadgeProps {
  count?: number;
  max?: number;
  variant?: 'default' | 'dot';
}

export function Badge({ count, max = 99, variant = 'default' }: BadgeProps) {
  if (variant === 'dot') {
    return <View style={styles.dot} />;
  }

  if (count === undefined || count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.fontInverse,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentRed,
  },
});
