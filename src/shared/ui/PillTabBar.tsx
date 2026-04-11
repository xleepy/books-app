import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BookOpen, Compass, MessageCircle, Trophy } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';

const ICONS = {
  Discover: Compass,
  Discussions: MessageCircle,
  Library: BookOpen,
  Compete: Trophy,
} as const;

const LABELS = {
  Discover: 'DISCOVER',
  Discussions: 'DISCUSSIONS',
  Library: 'LIBRARY',
  Compete: 'COMPETE',
} as const;

type TabKey = keyof typeof ICONS;

export function PillTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const key = route.name as TabKey;
          const Icon = ICONS[key];
          const label = LABELS[key];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const tint = focused ? colors.fontInverse : colors.tabInactive;
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, focused && styles.tabActive]}
            >
              <Icon size={18} color={tint} />
              <Text style={[styles.tabLabel, { color: tint }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 21,
    paddingTop: 12,
    backgroundColor: colors.bgPrimary,
  },
  pill: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: colors.bgCard,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    shadowColor: '#1A161410',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  tabActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
