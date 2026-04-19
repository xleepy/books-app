import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { colors } from '@shared/theme';

interface BookCoverProps {
  coverUrl?: string | null;
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  shadow?: boolean;
  resizeMode?: 'cover' | 'contain';
  style?: ViewStyle;
}

export function BookCover({
  coverUrl,
  width = '100%',
  height = 260,
  radius = 12,
  shadow = true,
  resizeMode = 'cover',
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
      {coverUrl ? (
        <Image
          key={coverUrl}
          source={{ uri: coverUrl }}
          style={[styles.image as ImageStyle, { borderRadius: radius }]}
          resizeMode={resizeMode}
        />
      ) : (
        <View style={[styles.placeholder, { borderRadius: radius }]}>
          <BookOpen size={32} color={colors.fontTertiary} />
        </View>
      )}
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#1A161420',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
});
