import { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radii, shadows } from '@shared/theme';

interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  size?: number;
  variant?: 'filled' | 'tonal' | 'outlined' | 'ghost';
}

export function IconButton({
  icon,
  onPress,
  size = 48,
  variant = 'ghost',
}: IconButtonProps) {
  const bg =
    variant === 'filled' ? colors.accent
    : variant === 'tonal' ? colors.accentLight
    : 'transparent';

  const showBorder = variant === 'outlined';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        showBorder && styles.border,
        variant === 'filled' && shadows.level2,
        pressed && styles.pressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.pill,
  },
  border: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
