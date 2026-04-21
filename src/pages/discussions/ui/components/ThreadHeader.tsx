import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';

interface ThreadHeaderProps {
  title: string;
  isOwner: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onDelete: () => void;
}

export function ThreadHeader({ title, isOwner, isDeleting, onBack, onDelete }: ThreadHeaderProps) {
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
          style={styles.deleteBtn}
          onPress={onDelete}
          disabled={isDeleting}
          accessibilityLabel="Delete thread"
        >
          {isDeleting
            ? <ActivityIndicator size="small" color={colors.accentRed} />
            : <Trash2 size={20} color={colors.accentRed} />
          }
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  deleteBtn: {
    padding: 4,
  },
  topBarTitle: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
});
