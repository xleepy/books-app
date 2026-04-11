import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookDetailScreen } from '@pages/book-detail/ui/BookDetailScreen';
import { ProgressScreen } from '@pages/progress/ui/ProgressScreen';
import { SettingsScreen } from '@pages/settings/ui/SettingsScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
