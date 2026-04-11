import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SlidersHorizontal } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { BookSwipeStack } from '@widgets/book-swipe-stack/ui/BookSwipeStack';
import { ScreenHeader } from '@pages/_shared/ScreenHeader';
import { Screen } from '@pages/_shared/Screen';
import { colors } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  return (
    <Screen>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Discover"
          rightAction={<SlidersHorizontal size={24} color={colors.fontSecondary} />}
          onAvatarPress={() => navigation.navigate('Progress')}
        />
      </View>
      <View style={styles.stackArea}>
        <BookSwipeStack onCardTap={(book) => navigation.navigate('BookDetail', { bookId: book.id })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 20,
  },
  stackArea: {
    flex: 1,
  },
});
