import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, MessageCircle } from 'lucide-react-native';
import { Avatar } from '@shared/ui';
import { BookCover } from '@entities/book/ui/BookCover';
import { colors, fontFamily } from '@shared/theme';
import type { ThreadDetail } from '@shared/api/discussionsApi.generated';

interface ThreadContentProps {
  thread: ThreadDetail;
  liked: boolean;
  likes: number;
  onLike: () => void;
  isLiking?: boolean;
}

export function ThreadContent({ thread, liked, likes, onLike, isLiking }: ThreadContentProps) {
  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <BookCover coverUrl={thread.coverUrl} width={52} height={72} radius={6} shadow={false} />
        <View style={styles.metaInfo}>
          <Text style={styles.threadTitle}>{thread.title}</Text>
          <Text style={styles.bookContext}>{thread.bookContext}</Text>
          {thread.spoiler && (
            <View style={styles.spoilerTag}>
              <Text style={styles.spoilerText}>⚠ Spoilers</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.body}>{thread.body}</Text>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <Avatar
            initials={thread.creatorName.split(' ').filter(Boolean).map((p: string) => p[0]).join('')}
            size={28}
            hue={thread.creatorAvatarHue}
          />
          <Text style={styles.authorName}>{thread.creatorName}</Text>
          <Text style={styles.timeAgo}>{thread.timeAgo}</Text>
        </View>
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <MessageCircle size={16} color={colors.fontTertiary} />
            <Text style={styles.actionCount}>{thread.replies.length}</Text>
          </View>
          <Pressable style={styles.actionItem} onPress={onLike} disabled={isLiking}>
            {isLiking ? (
              <ActivityIndicator size={16} color={colors.accentRed} />
            ) : (
              <Heart
                size={16}
                color={liked ? colors.accentRed : colors.fontTertiary}
                fill={liked ? colors.accentRed : 'none'}
              />
            )}
            <Text style={[styles.actionCount, liked && styles.likedCount]}>
              {likes}
            </Text>
          </Pressable>
        </View>
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
    gap: 14,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  metaInfo: {
    flex: 1,
    gap: 4,
  },
  bookContext: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  threadTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.fontPrimary,
    lineHeight: 24,
  },
  spoilerTag: {
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
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.fontPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontPrimary,
  },
  timeAgo: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontTertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontTertiary,
  },
  likedCount: {
    color: colors.accentRed,
  },
});
