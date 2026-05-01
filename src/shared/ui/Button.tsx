import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors, fontFamily, radii, shadows } from '@shared/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  sm:  { height: 36, paddingHorizontal: 16 },
  md:  { height: 48, paddingHorizontal: 24 },
  lg:  { height: 52, paddingHorizontal: 28 },
};

const SIZE_FONT: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 16,
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {};
  const textStyle: TextStyle = {};

  switch (variant) {
    case 'primary':
      containerStyle.backgroundColor = colors.accent;
      if (!isDisabled) Object.assign(containerStyle, shadows.level2);
      textStyle.color = colors.fontInverse;
      break;
    case 'secondary':
      containerStyle.backgroundColor = colors.bgSecondary;
      textStyle.color = colors.fontPrimary;
      break;
    case 'outline':
      containerStyle.borderWidth = 1;
      containerStyle.borderColor = colors.border;
      containerStyle.backgroundColor = 'transparent';
      textStyle.color = colors.accent;
      break;
    case 'ghost':
      containerStyle.backgroundColor = 'transparent';
      textStyle.color = colors.accent;
      break;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        SIZE_STYLES[size],
        fullWidth && styles.fullWidth,
        containerStyle,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.fontInverse : colors.accent}
        />
      ) : icon ? (
        icon
      ) : null}
      <Text
        style={[
          styles.label,
          { fontSize: SIZE_FONT[size] },
          textStyle,
          isDisabled && styles.labelDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.pill,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fontFamily.semibold,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
