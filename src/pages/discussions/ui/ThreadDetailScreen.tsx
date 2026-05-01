import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetThreadQuery,
  useToggleLikeMutation,
  usePostReplyMutation,
  useDeleteThreadMutation,
  useDeleteReplyMutation,
} from "@shared/api/discussionsApi.generated";
import { colors } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";
import { ThreadHeader } from "./components/ThreadHeader";
import { ThreadContent } from "./components/ThreadContent";
import { ReplyList } from "./components/ReplyList";
import { ReplyBar } from "./components/ReplyBar";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "ThreadDetail">;

export function ThreadDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const {
    data: thread,
    isLoading,
    refetch,
  } = useGetThreadQuery(params.threadId);
  const [likeThread, { isLoading: isLiking }] = useToggleLikeMutation();
  const [postReply, { isLoading: isPosting }] = usePostReplyMutation();
  const [deleteThread] = useDeleteThreadMutation();
  const [deleteReply] = useDeleteReplyMutation();

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
    try {
      await postReply({ id: thread.id, body: { body: text } }).unwrap();
      await refetch();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    } catch {
      Alert.alert("Error", "Failed to post the reply. Please try again.");
    }
  }

  function handleThreadMenuPress() {
    if (!thread) return;
    Alert.alert("Thread Options", undefined, [
      {
        text: "Edit Thread",
        onPress: () =>
          navigation.navigate("EditThread", {
            threadId: thread.id,
            title: thread.title,
            body: thread.body,
          }),
      },
      {
        text: "Delete Thread",
        style: "destructive",
        onPress: handleDeleteThread,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  function handleDeleteThread() {
    if (!thread) return;
    Alert.alert(
      "Delete Thread",
      "Are you sure you want to delete this thread? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteThread(thread.id).unwrap();
              navigation.goBack();
            } catch {
              Alert.alert(
                "Error",
                "Failed to delete the thread. Please try again.",
              );
            }
          },
        },
      ],
    );
  }

  function handleReplyMenuPress(replyId: string) {
    Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteReply({ id: params.threadId, replyId }).unwrap();
            await refetch();
          } catch {
            Alert.alert(
              "Error",
              "Failed to delete the reply. Please try again.",
            );
          }
        },
      },
    ]);
  }

  if (isLoading || !thread) {
    return (
      <View style={[styles.loadingWrap, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ThreadHeader
        title={thread.title}
        isOwner={thread.isOwner}
        onBack={() => navigation.goBack()}
        onMenuPress={handleThreadMenuPress}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <ThreadContent
          thread={thread}
          liked={currentLiked}
          likes={currentLikes}
          onLike={handleLike}
          isLiking={isLiking}
        />
        <ReplyList
          replies={thread.replies}
          onReplyMenuPress={handleReplyMenuPress}
        />
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ReplyBar onSubmit={handleReply} isPosting={isPosting} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
