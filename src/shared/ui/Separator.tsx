import { StyleSheet, View } from 'react-native';
import { colors } from '@shared/theme';

export function Separator() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.borderLight,
    width: '100%',
  },
});
