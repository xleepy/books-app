import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { colors, fontFamily, radii } from "@shared/theme";

interface AcceptRejectButtonsProps {
  requestId: string;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function AcceptRejectButtons({
  requestId,
  onAccept,
  onReject,
}: AcceptRejectButtonsProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [
          styles.acceptBtn,
          pressed && styles.pressed,
        ]}
        onPress={() => onAccept(requestId)}
      >
        <Check size={14} color={colors.fontInverse} />
        <Text style={styles.acceptText}>Accept</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.rejectBtn,
          pressed && styles.pressed,
        ]}
        onPress={() => onReject(requestId)}
      >
        <X size={14} color={colors.fontPrimary} />
        <Text style={styles.rejectText}>Reject</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  rejectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontInverse,
  },
  rejectText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.fontPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
});
