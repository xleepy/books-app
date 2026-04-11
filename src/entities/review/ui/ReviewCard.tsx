import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { Avatar, StarRating } from '@shared/ui';
import { Review } from '../model/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar
          initials={review.reviewer
            .split(' ')
            .map((p) => p[0])
            .join('')}
          size={36}
          hue={review.avatarHue}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{review.reviewer}</Text>
          <View style={styles.metaRow}>
            <StarRating value={review.rating} size={12} />
            <Text style={styles.date}>· {review.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.body}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontTertiary,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.fontSecondary,
  },
});
