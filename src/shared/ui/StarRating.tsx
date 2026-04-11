import { StyleSheet, View } from 'react-native';
import { Star, StarHalf } from 'lucide-react-native';
import { colors } from '@shared/theme';

interface StarRatingProps {
  value: number;
  size?: number;
  color?: string;
}

export function StarRating({ value, size = 16, color = colors.starGold }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const idx = i + 1;
    if (value >= idx) return 'full' as const;
    if (value >= idx - 0.5) return 'half' as const;
    return 'empty' as const;
  });

  return (
    <View style={styles.row}>
      {stars.map((kind, i) =>
        kind === 'half' ? (
          <StarHalf key={i} size={size} color={color} fill={color} />
        ) : kind === 'full' ? (
          <Star key={i} size={size} color={color} fill={color} />
        ) : (
          <Star key={i} size={size} color={color} />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 3,
  },
});
