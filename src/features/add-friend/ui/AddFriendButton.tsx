import { Pressable, Text, StyleSheet } from "react-native";
import { useSendFriendRequestMutation } from "@shared/api/friendsApi.generated";
import { colors, fontFamily, radii } from "@shared/theme";

interface AddFriendButtonProps {
  userId: string;
}

export function AddFriendButton({ userId }: AddFriendButtonProps) {
  const [sendRequest, { isLoading }] = useSendFriendRequestMutation();

  const handlePress = async () => {
    try {
      await sendRequest({ userId }).unwrap();
    } catch {
      // Error handled by caller (Toast)
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text style={styles.text}>
        {isLoading ? "Sending..." : "Add Friend"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontInverse,
  },
});
