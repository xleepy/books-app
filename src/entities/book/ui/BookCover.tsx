import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { bookCovers, BookCoverKey } from '@shared/assets/images';
import { colors } from '@shared/theme';

interface BookCoverProps {
  cover: BookCoverKey;
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  shadow?: boolean;
  style?: ViewStyle;
}

export function BookCover({
  cover,
  width = '100%',
  height = 260,
  radius = 12,
  shadow = true,
  style,
}: BookCoverProps) {
  return (
    <View
      style={[
        styles.wrap,
        shadow && styles.shadow,
        { width, height, borderRadius: radius },
        style,
      ]}
    >
      <Image
        source={bookCovers[cover]}
        style={[styles.image as ImageStyle, { borderRadius: radius }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.bgSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    shadowColor: '#1A161420',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
});
