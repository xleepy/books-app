import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useGetThreadsByIdQuery,
  usePostThreadsByIdLikeMutation,
  usePostThreadsByIdRepliesMutation,
  useDeleteThreadsByIdMutation,
} from '@shared/api/discussionsApi.generated';
import { colors } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';
import { ThreadHeader } from './components/ThreadHeader';
import { ThreadContent } from './components/ThreadContent';
import { ReplyList } from './components/ReplyList';
import { ReplyBar } from './components/ReplyBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ThreadDetail'>;

export function ThreadDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const { data: thread, isLoading, refetch } = useGetThreadsByIdQuery(params.threadId);
  const [likeThread, { isLoading: isLiking }] = usePostThreadsByIdLikeMutation();
  const [postReply, { isLoading: isPosting }] = usePostThreadsByIdRepliesMutation();
  const [deleteThread, { isLoading: isDeleting }] = useDeleteThreadsByIdMutation();

  const [liked, setLiked] = useState<boolean | undefined>(undefined);
  const [localLikes, setLocalLikes] = useState<number | undefined>(undefined);

  const currentLiked = liked ?? thread?.liked ?? false;
  const currentLikes = localLikes ?? thread?.likes ?? 0;

  async function handleLike() {
    if (!thread) return;
    try {
      const result = await likeThread(thread.id).unwrap();
      setLiked(result.liked);
      setLocalLikes(result.likes);
    } catch {
      // Ignore like errors silently
    }
  }

  async function handleReply(text: string) {
    if (!thread) return;
    await postReply({ id: thread.id, body: { body: text } }).unwrap();
    await refetch();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  }

  function handleDeletePress() {
    if (!thread) return;
    Alert.alert(
      'Delete Thread',
      'Are you sure you want to delete this thread? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThread(thread.id).unwrap();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to delete the thread. Please try again.');
            }
          },
        },
      ]
    );
  }

  if (isLoading || !thread) {
    return (
      <View style={[styles.loadingWrap, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.bottom + 8}
    >
      <ThreadHeader
        title={thread.title}
        isOwner={thread.isOwner}
        isDeleting={isDeleting}
        onBack={() => navigation.goBack()}
        onDelete={handleDeletePress}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThreadContent
          thread={thread}
          liked={currentLiked}
          likes={currentLikes}
          onLike={handleLike}
          isLiking={isLiking}
        />
        <ReplyList replies={thread.replies} />
      </ScrollView>

      <ReplyBar onSubmit={handleReply} isPosting={isPosting} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 8,
  },
});
