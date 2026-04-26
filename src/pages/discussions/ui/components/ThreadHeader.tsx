import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, EllipsisVertical } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface ThreadHeaderProps {
  title: string;
  isOwner: boolean;
  onBack: () => void;
  onMenuPress: () => void;
}

export function ThreadHeader({
  title,
  isOwner,
  onBack,
  onMenuPress,
}: ThreadHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <ChevronLeft size={24} color={colors.fontPrimary} />
      </Pressable>
      <Text style={styles.topBarTitle} numberOfLines={1}>
        {title}
      </Text>
      {isOwner && (
        <Pressable
          style={styles.menuBtn}
          onPress={onMenuPress}
          accessibilityLabel="Thread options"
        >
          <EllipsisVertical size={22} color={colors.fontPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  menuBtn: {
    padding: 4,
  },
  topBarTitle: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
});
