import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { Avatar } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";
import type { Friend } from "@entities/friend/model/types";

interface FriendRowProps {
  friend: Friend;
  onRemove: (friendshipId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("");
}

export function FriendRow({ friend, onRemove }: FriendRowProps) {
  const initials = getInitials(friend.username);

  const handleRemove = () => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove @${friend.username} from your friends list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemove(friend.id),
        },
      ],
    );
  };

  return (
    <View style={styles.row}>
      <Avatar
        initials={initials}
        size={44}
        hue={(friend.avatarHue * 30 + 40) % 360}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{friend.username}</Text>
        <Text style={styles.meta}>
          {friend.levelTitle ?? `Level ${friend.level}`}
          {friend.mutualCount ? ` · ${friend.mutualCount} mutual` : ""}
        </Text>
      </View>
      <Pressable style={styles.overflow} onPress={handleRemove}>
        <MoreVertical size={18} color={colors.fontTertiary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  meta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  overflow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
