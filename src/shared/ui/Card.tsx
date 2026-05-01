import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '@shared/theme';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  padding?: number;
  style?: ViewStyle;
}

export function Card({ children, onPress, padding = 16, style }: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding,
    ...shadows.level1,
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
  },
});
