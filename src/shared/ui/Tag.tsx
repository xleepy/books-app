import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';

interface TagProps {
  label: string;
  variant?: 'accent' | 'muted';
}

export function Tag({ label, variant = 'accent' }: TagProps) {
  const isAccent = variant === 'accent';
  return (
    <View style={[styles.tag, isAccent ? styles.accent : styles.muted]}>
      <Text style={[styles.label, isAccent ? styles.labelAccent : styles.labelMuted]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  accent: {
    backgroundColor: colors.accentLight,
  },
  muted: {
    backgroundColor: colors.bgSecondary,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  labelAccent: {
    color: colors.accent,
  },
  labelMuted: {
    color: colors.fontSecondary,
  },
});
