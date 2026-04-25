import { View, StyleSheet } from "react-native";
import { colors } from "@shared/theme";

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
