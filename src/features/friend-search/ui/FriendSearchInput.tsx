import { StyleSheet, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { colors, fontFamily, radii } from "@shared/theme";

interface FriendSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function FriendSearchInput({
  value,
  onChangeText,
  placeholder = "Search or add friend...",
}: FriendSearchInputProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.fontTertiary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.fontTertiary}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.fontPrimary,
    padding: 0,
  },
});
