import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DiscoverScreen } from '@pages/discover/ui/DiscoverScreen';
import { DiscussionsScreen } from '@pages/discussions/ui/DiscussionsScreen';
import { LibraryScreen } from '@pages/library/ui/LibraryScreen';
import { ChallengesScreen } from '@pages/challenges/ui/ChallengesScreen';
import { PillTabBar } from '@shared/ui';
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function wrapScreen<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  name: string,
) {
  return function WrappedScreen(props: T) {
    return (
      <ErrorBoundary screenName={name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Discover" component={wrapScreen(DiscoverScreen, "Discover")} />
      <Tab.Screen name="Discussions" component={wrapScreen(DiscussionsScreen, "Discussions")} />
      <Tab.Screen name="Library" component={wrapScreen(LibraryScreen, "Library")} />
      <Tab.Screen name="Compete" component={wrapScreen(ChallengesScreen, "Compete")} />
    </Tab.Navigator>
  );
}
