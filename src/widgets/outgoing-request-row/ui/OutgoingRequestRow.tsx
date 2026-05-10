import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";
import type { FriendRequest } from "@entities/friend/model/types";

interface OutgoingRequestRowProps {
  request: FriendRequest;
  onCancel: (requestId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("");
}

function timeAgo(isoDate: string): string {
  const secs = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 1000,
  );
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function OutgoingRequestRow({
  request,
  onCancel,
}: OutgoingRequestRowProps) {
  const initials = getInitials(request.username);

  return (
    <View style={styles.row}>
      <Avatar
        initials={initials}
        size={44}
        hue={(request.avatarHue * 30 + 40) % 360}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{request.username}</Text>
        <Text style={styles.meta}>
          Request sent · {timeAgo(request.sentAt)}
        </Text>
      </View>
      <Pressable
        style={styles.cancelBtn}
        onPress={() => onCancel(request.id)}
      >
        <Text style={styles.cancelText}>Cancel</Text>
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
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.accentRed,
  },
});
