import { StyleSheet, View } from 'react-native';
import { Bookmark, Heart, X } from 'lucide-react-native';
import { ActionButton } from '@shared/ui';
import { colors } from '@shared/theme';

interface SwipeActionsProps {
  onPass?: () => void;
  onBookmark?: () => void;
  onLike?: () => void;
}

export function SwipeActions({ onPass, onBookmark, onLike }: SwipeActionsProps) {
  return (
    <View style={styles.row}>
      <ActionButton size={56} onPress={onPass}>
        <X size={24} color={colors.fontSecondary} />
      </ActionButton>
      <ActionButton size={48} onPress={onBookmark}>
        <Bookmark size={20} color={colors.starGold} fill={colors.starGold} />
      </ActionButton>
      <ActionButton
        size={56}
        background={colors.accent}
        borderColor="transparent"
        shadowColor="#C45A3C40"
        onPress={onLike}
      >
        <Heart size={24} color={colors.fontInverse} fill={colors.fontInverse} />
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
});
