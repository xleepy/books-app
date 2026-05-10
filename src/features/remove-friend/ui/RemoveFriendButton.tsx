import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import { useRemoveFriendMutation } from "@shared/api/friendsApi.generated";
import { colors } from "@shared/theme";

interface RemoveFriendButtonProps {
  friendshipId: string;
  username: string;
}

export function RemoveFriendButton({
  friendshipId,
  username,
}: RemoveFriendButtonProps) {
  const [removeFriend] = useRemoveFriendMutation();

  const handleRemove = () => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove @${username} from your friends list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFriend(friendshipId).unwrap();
            } catch {
              // Toast handled by caller
            }
          },
        },
      ],
    );
  };

  return (
    <View>
      <Pressable style={styles.overflow} onPress={handleRemove}>
        <MoreVertical size={18} color={colors.fontTertiary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overflow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
