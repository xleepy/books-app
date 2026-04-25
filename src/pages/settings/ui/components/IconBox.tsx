import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface IconBoxProps {
  icon: ReactNode;
  bg: string;
}

export function IconBox({ icon, bg }: IconBoxProps) {
  return <View style={[styles.root, { backgroundColor: bg }]}>{icon}</View>;
}

const styles = StyleSheet.create({
  root: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
