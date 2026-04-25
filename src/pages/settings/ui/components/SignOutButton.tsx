import { Pressable, StyleSheet, Text } from "react-native";
import { LogOut } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface SignOutButtonProps {
  onPress: () => void;
}

export function SignOutButton({ onPress }: SignOutButtonProps) {
  return (
    <Pressable style={styles.root} onPress={onPress}>
      <LogOut size={18} color={colors.accentRed} />
      <Text style={styles.text}>Sign Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  text: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.accentRed,
  },
});
