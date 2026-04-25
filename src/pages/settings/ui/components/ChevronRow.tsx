import { ReactNode } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

function IconBox({ icon, bg }: { icon: ReactNode; bg: string }) {
  return (
    <View style={[styles.iconBox, { backgroundColor: bg }]}>{icon}</View>
  );
}

export function ChevronRow({
  icon,
  iconBg,
  title,
  subtitle,
  value,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  value?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBox icon={icon} bg={iconBg} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <ChevronRight size={16} color={colors.fontTertiary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  rowSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontTertiary,
  },
});
