import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUpdateThreadMutation } from "@shared/api/discussionsApi.generated";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "EditThread">;

export function EditThreadScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const [updateThread, { isLoading }] = useUpdateThreadMutation();

  const [title, setTitle] = useState(params.title);
  const [body, setBody] = useState(params.body);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    title.trim().length > 0 && body.trim().length > 0 && !isLoading;

  async function handleSave() {
    if (!canSubmit) return;
    setError(null);
    try {
      await updateThread({
        id: params.threadId,
        body: { title: title.trim(), body: body.trim() },
      }).unwrap();
      navigation.goBack();
    } catch {
      setError("Failed to update thread. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={22} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Thread</Text>
        <Pressable
          style={[styles.postBtn, !canSubmit && styles.postBtnDisabled]}
          onPress={handleSave}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.fontInverse} />
          ) : (
            <Text style={styles.postBtnText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What's your thread about?"
            placeholderTextColor={colors.fontTertiary}
            style={styles.titleInput}
            maxLength={200}
            returnKeyType="next"
          />
          <Text style={styles.counter}>{title.length}/200</Text>
        </View>

        {/* Body */}
        <View style={styles.field}>
          <Text style={styles.label}>Body</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Share your thoughts, questions, or discoveries..."
            placeholderTextColor={colors.fontTertiary}
            style={styles.bodyInput}
            multiline
            maxLength={10000}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{body.length}/10000</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  postBtn: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 64,
    alignItems: "center",
  },
  postBtnDisabled: {
    backgroundColor: colors.border,
  },
  postBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontInverse,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  errorBanner: {
    backgroundColor: "#FDECEA",
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: "#C62828",
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  titleInput: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.fontPrimary,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 48,
  },
  bodyInput: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.fontPrimary,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 200,
  },
  counter: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontTertiary,
    textAlign: "right",
  },
});
