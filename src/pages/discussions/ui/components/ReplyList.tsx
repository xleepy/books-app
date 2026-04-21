import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { ReplyItem } from './ReplyItem';
import type { ThreadReply } from '@shared/api/discussionsApi.generated';

interface ReplyListProps {
  replies: ThreadReply[];
}

export function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) return null;

  return (
    <View style={styles.repliesSection}>
      <Text style={styles.repliesTitle}>
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </Text>
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  repliesSection: {
    gap: 12,
  },
  repliesTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
});
