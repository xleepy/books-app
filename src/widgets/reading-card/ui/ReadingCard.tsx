import { StyleSheet, Text, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { BookCover } from '@entities/book/ui/BookCover';
import { BookCoverKey } from '@shared/assets/images';
import { colors, fontFamily } from '@shared/theme';
import { ProgressBar } from '@shared/ui';

interface ReadingCardProps {
  cover: BookCoverKey;
  title: string;
  author: string;
  progress: number;
  timeLeft: string;
}

export function ReadingCard({ cover, title, author, progress, timeLeft }: ReadingCardProps) {
  const pct = Math.round(progress * 100);
  return (
    <View style={styles.card}>
      <BookCover cover={cover} width={72} height={108} radius={8} shadow={false} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <View style={styles.progressWrap}>
          <ProgressBar value={progress} />
          <Text style={styles.progressText}>
            {pct}% complete · {timeLeft}
          </Text>
        </View>
        <View style={styles.continueBtn}>
          <BookOpen size={14} color={colors.fontInverse} />
          <Text style={styles.continueText}>Continue Reading</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  author: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontSecondary,
  },
  progressWrap: {
    gap: 6,
    marginTop: 4,
  },
  progressText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontTertiary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    height: 36,
    borderRadius: 10,
    marginTop: 4,
  },
  continueText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontInverse,
  },
});
