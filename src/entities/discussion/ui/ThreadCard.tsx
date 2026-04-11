import { StyleSheet, Text, View } from 'react-native';
import { Heart, MessageCircle } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { BookCover } from '@entities/book/ui/BookCover';
import { Thread } from '../model/types';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <BookCover cover={thread.cover} width={48} height={68} radius={6} shadow={false} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {thread.title}
          </Text>
          <Text style={styles.book}>{thread.bookContext}</Text>
          {thread.spoiler && (
            <View style={styles.spoiler}>
              <Text style={styles.spoilerText}>⚠ Spoilers</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {thread.preview}
      </Text>
      <View style={styles.bottom}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <MessageCircle size={14} color={colors.fontTertiary} />
            <Text style={styles.statText}>{thread.replies} replies</Text>
          </View>
          <View style={styles.stat}>
            <Heart
              size={14}
              color={thread.liked ? colors.accentRed : colors.fontTertiary}
              fill={thread.liked ? colors.accentRed : 'none'}
            />
            <Text style={styles.statText}>{thread.likes}</Text>
          </View>
        </View>
        <Text style={styles.time}>{thread.timeAgo}</Text>
      </View>
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
  top: {
    flexDirection: 'row',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  book: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  spoiler: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  spoilerText: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    color: colors.accent,
  },
  preview: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.fontSecondary,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 14,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontTertiary,
  },
  time: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontTertiary,
  },
});
