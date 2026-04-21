import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';

interface AddToLibraryButtonProps {
  onPress?: () => void;
  label?: string;
  isLoading?: boolean;
}

export function AddToLibraryButton({
  onPress,
  label = 'Add to Library',
  isLoading = false,
}: AddToLibraryButtonProps) {
  return (
    <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={onPress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.fontInverse} />
      ) : (
        <Plus size={20} color={colors.fontInverse} />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    shadowColor: '#C45A3C30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontInverse,
  },
});
