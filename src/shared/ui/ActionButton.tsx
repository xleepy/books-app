import { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@shared/theme';

interface ActionButtonProps {
  size?: number;
  background?: string;
  borderColor?: string;
  shadowColor?: string;
  onPress?: () => void;
  children: ReactNode;
}

export function ActionButton({
  size = 56,
  background = colors.bgCard,
  borderColor = colors.border,
  shadowColor = Platform.OS === 'ios' ? '#0000000D' : '#1A161410',
  onPress,
  children,
}: ActionButtonProps) {
  const style: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: background,
    borderWidth: borderColor === 'transparent' ? 0 : 1.5,
    borderColor,
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  };
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, style]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
