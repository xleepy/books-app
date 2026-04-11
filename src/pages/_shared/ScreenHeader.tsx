import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { Avatar } from '@shared/ui';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
  hue?: number;
}

export function ScreenHeader({ title, subtitle, rightAction, hue = 18 }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>
        {rightAction}
        <Avatar initials="JD" size={40} hue={hue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: 4,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.fontPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
