import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';

interface AvatarProps {
  initials?: string;
  size?: number;
  hue?: number;
}

export function Avatar({ initials = '', size = 40, hue = 18 }: AvatarProps) {
  const bg = `hsl(${hue}, 55%, 78%)`;
  const fg = `hsl(${hue}, 60%, 28%)`;
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={[styles.initials, { color: fg, fontSize: size * 0.4 }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  initials: {
    fontFamily: fontFamily.bold,
  },
});
