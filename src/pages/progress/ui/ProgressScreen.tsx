import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Settings } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { LevelCard } from '@widgets/level-card/ui/LevelCard';
import { StreakCard } from '@widgets/streak-card/ui/StreakCard';
import { StatsGrid } from '@widgets/stats-grid/ui/StatsGrid';
import { BadgesRow } from '@widgets/badges-row/ui/BadgesRow';
import { Screen } from '@shared/ui/Screen';
import { colors, fontFamily } from '@shared/theme';
import { Avatar } from '@shared/ui';
import { RootState } from '@store/store';
import { RootStackParamList } from '@app/navigation/types';
import { useGetMeBadgesQuery } from '@shared/api/meApi.generated';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProgressScreen() {
  const navigation = useNavigation<Nav>();
  const user = useSelector((state: RootState) => state.user.user);
  const stats = useSelector((state: RootState) => state.user.stats);
  const { data: badgesData, isLoading: badgesLoading } = useGetMeBadgesQuery();
  const badges = badgesData?.data ?? [];

  return (
    <Screen scroll>
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={colors.fontPrimary} />
          </Pressable>
          <Text style={styles.title}>My Progress</Text>
          <View style={styles.headerRight}>
            <Pressable onPress={() => navigation.navigate('Settings')}>
              <Settings size={24} color={colors.fontPrimary} />
            </Pressable>
            <Avatar
              initials={user.name.split(' ').filter(Boolean).map((p) => p[0]).join('')}
              size={40}
              hue={user.avatarHue}
            />
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <LevelCard user={user} />
      </View>
      <View style={styles.section}>
        <StreakCard
          streak={stats.streak}
          bestStreak={stats.bestStreak}
          weekDays={stats.weekDays}
        />
      </View>
      <View style={styles.section}>
        <StatsGrid stats={stats} />
      </View>
      <View style={styles.badgesHeader}>
        <Text style={styles.badgesTitle}>Recent Badges</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <BadgesRow badges={badges} isLoading={badgesLoading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    marginRight: 8,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.fontPrimary,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {
    marginBottom: 20,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  seeAll: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.accent,
  },
});
