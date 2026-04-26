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
import { useUpdateChallengeMutation } from "@shared/api/challengesApi.generated";
import { colors, fontFamily } from "@shared/theme";
import { RootStackParamList } from "@app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "EditChallenge">;

export function EditChallengeScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const [updateChallenge, { isLoading }] = useUpdateChallengeMutation();

  const [title, setTitle] = useState(params.title);
  const [description, setDescription] = useState(params.description);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    title.trim().length > 0 && !isLoading;

  async function handleSave() {
    if (!canSubmit) return;
    setError(null);
    try {
      await updateChallenge({
        id: params.challengeId,
        body: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      }).unwrap();
      navigation.goBack();
    } catch {
      setError("Failed to update challenge. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={22} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Challenge</Text>
        <Pressable
          style={[styles.saveBtn, !canSubmit && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.fontInverse} />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Challenge Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. April Reading Sprint"
            placeholderTextColor={colors.fontTertiary}
            style={styles.input}
            maxLength={80}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this challenge about?"
            placeholderTextColor={colors.fontTertiary}
            style={[styles.input, styles.bodyInput]}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.lockedNotice}>
          <Text style={styles.lockedText}>
            Goal metric, target, and dates cannot be changed after creation.
          </Text>
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
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 64,
    alignItems: "center",
  },
  saveBtnDisabled: {
    backgroundColor: colors.border,
  },
  saveBtnText: {
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
  input: {
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
    height: 120,
  },
  lockedNotice: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 14,
  },
  lockedText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontSecondary,
    textAlign: "center",
  },
});
