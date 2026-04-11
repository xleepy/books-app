import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontFamily } from '@shared/theme';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterChip({ label, active = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: colors.accent,
  },
  inactive: {
    backgroundColor: colors.bgSecondary,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
  },
  labelActive: {
    color: colors.fontInverse,
  },
  labelInactive: {
    color: colors.fontSecondary,
  },
});
