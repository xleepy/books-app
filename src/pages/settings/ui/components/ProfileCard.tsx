import { Pressable, StyleSheet, Text, View } from "react-native";
import { Pencil } from "lucide-react-native";
import { Avatar } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";

interface ProfileCardProps {
  name: string;
  initials: string;
  avatarHue: number;
  level: number;
  levelTitle: string;
}

export function ProfileCard({
  name,
  initials,
  avatarHue,
  level,
  levelTitle,
}: ProfileCardProps) {
  return (
    <View style={styles.root}>
      <Avatar initials={initials} size={84} hue={avatarHue} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.levelRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNum}>{level}</Text>
        </View>
        <Text style={styles.levelLabel}>
          Level {level} · {levelTitle}
        </Text>
      </View>
      <Pressable style={styles.editBtn}>
        <Pencil size={14} color={colors.accent} />
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontPrimary,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  levelBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.xpPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  levelNum: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.fontInverse,
  },
  levelLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  editBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.accent,
  },
});
