import { StyleSheet, Text } from "react-native";
import { fontFamily } from "@shared/theme";
import { colors } from "@shared/theme";

interface SectionLabelProps {
  text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.fontSecondary,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 0,
  },
});
