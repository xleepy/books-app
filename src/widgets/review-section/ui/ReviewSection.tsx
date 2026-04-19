import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ReviewCard } from '@entities/review/ui/ReviewCard';
import { useGetBooksByIdReviewsQuery } from '@store/api/reviewsApi.generated';
import { colors, fontFamily } from '@shared/theme';
import { StarRating } from '@shared/ui';

interface ReviewSectionProps {
  bookId: string;
  rating: number;
  reviewCount: number;
}

export function ReviewSection({ bookId, rating, reviewCount }: ReviewSectionProps) {
  const { data, isLoading } = useGetBooksByIdReviewsQuery({ id: bookId });
  const reviews = data?.data ?? [];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.count}>{reviewCount} reviews</Text>
      </View>
      <View style={styles.summary}>
        <Text style={styles.bigNumber}>{rating}</Text>
        <View style={styles.summaryRight}>
          <StarRating value={rating} size={14} />
          <Text style={styles.summaryText}>Based on {reviewCount} reviews</Text>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <View style={styles.list}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontPrimary,
  },
  count: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontSecondary,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: 16,
  },
  bigNumber: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    color: colors.fontPrimary,
  },
  summaryRight: {
    gap: 4,
  },
  summaryText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  list: {
    gap: 12,
  },
});
