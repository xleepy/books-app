import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";
import { AcceptRejectButtons } from "@features/accept-reject/ui/AcceptRejectButtons";
import type { FriendRequest } from "@entities/friend/model/types";

interface IncomingRequestRowProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("");
}

export function IncomingRequestRow({
  request,
  onAccept,
  onReject,
}: IncomingRequestRowProps) {
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
          {request.levelTitle ?? `Level ${request.level}`}
        </Text>
      </View>
      <AcceptRejectButtons
        requestId={request.id}
        onAccept={onAccept}
        onReject={onReject}
      />
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
});
