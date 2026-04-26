import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface ReplyBarProps {
  onSubmit: (text: string) => Promise<void>;
  isPosting: boolean;
}

export function ReplyBar({ onSubmit, isPosting }: ReplyBarProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  async function handleSend() {
    if (!text.trim() || isPosting) return;
    await onSubmit(text.trim());
    setText("");
  }

  return (
    <View style={[styles.replyBar, { paddingBottom: insets.bottom + 8 }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a reply..."
        placeholderTextColor={colors.fontTertiary}
        style={styles.replyInput}
        multiline
        maxLength={5000}
      />
      <Pressable
        style={[
          styles.sendBtn,
          (!text.trim() || isPosting) && styles.sendBtnDisabled,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || isPosting}
      >
        {isPosting ? (
          <ActivityIndicator size="small" color={colors.fontInverse} />
        ) : (
          <Send size={18} color={colors.fontInverse} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  replyBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.bgPrimary,
  },
  replyInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
