import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { Avatar } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";

interface SettingsHeaderProps {
  initials: string;
  avatarHue: number;
  onBack: () => void;
}

export function SettingsHeader({ initials, avatarHue, onBack }: SettingsHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={22} color={colors.fontPrimary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={[styles.headerSide, styles.headerSideRight]}>
        <Avatar initials={initials} size={36} hue={avatarHue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  headerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
});
