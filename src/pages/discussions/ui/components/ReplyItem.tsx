import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@shared/ui';
import { colors, fontFamily } from '@shared/theme';
import type { ThreadReply } from '@shared/api/discussionsApi.generated';

interface ReplyItemProps {
  reply: ThreadReply;
}

export function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <View style={styles.replyItem}>
      <Avatar
        initials={reply.creatorName.split(' ').filter(Boolean).map((p) => p[0]).join('')}
        size={32}
        hue={reply.creatorAvatarHue}
      />
      <View style={styles.replyContent}>
        <View style={styles.replyHeader}>
          <Text style={styles.replyAuthor}>{reply.creatorName}</Text>
          <Text style={styles.replyTime}>{reply.timeAgo}</Text>
        </View>
        <Text style={styles.replyBody}>{reply.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  replyItem: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  replyContent: {
    flex: 1,
    gap: 4,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyAuthor: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontPrimary,
  },
  replyTime: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontTertiary,
  },
  replyBody: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.fontPrimary,
  },
});
