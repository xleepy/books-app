import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DiscoverScreen } from '@pages/discover/ui/DiscoverScreen';
import { DiscussionsScreen } from '@pages/discussions/ui/DiscussionsScreen';
import { LibraryScreen } from '@pages/library/ui/LibraryScreen';
import { ChallengesScreen } from '@pages/challenges/ui/ChallengesScreen';
import { PillTabBar } from '@shared/ui';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Discussions" component={DiscussionsScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Compete" component={ChallengesScreen} />
    </Tab.Navigator>
  );
}
