import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trophy, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGetChallengesQuery } from '@shared/api/challengesApi.generated';
import { ChallengeCard } from '@entities/challenge/ui/ChallengeCard';
import { FilterRow } from '@features/filter-list/ui/FilterRow';
import { Screen } from '@shared/ui/Screen';
import { ScreenHeader } from '@shared/ui/ScreenHeader';
import { colors, fontFamily } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ChallengesScreen() {
  const navigation = useNavigation<Nav>();
  const {
    data: challengesData,
    isLoading: challengesLoading,
    isFetching,
    refetch,
  } = useGetChallengesQuery(undefined);
  const challenges = challengesData?.data ?? [];

  return (
    <Screen>
      {/* Fixed header */}
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Challenges"
          rightAction={
            <View style={styles.headerActions}>
              <Pressable
                style={styles.createBtn}
                onPress={() => navigation.navigate('CreateChallenge')}
              >
                <Plus size={20} color={colors.accent} />
              </Pressable>
              <Pressable style={styles.trophyBtn}>
                <Trophy size={20} color={colors.badgeGold} />
              </Pressable>
            </View>
          }
        />
      </View>

      {/* Fixed filter chips */}
      <View style={styles.filterWrap}>
        <FilterRow filters={['Active', 'Monthly', 'Yearly', 'Weekly', 'Custom']} />
      </View>
      <Text style={styles.sectionTitle}>Active Challenges</Text>
      {/* Scrollable challenge list with pull-to-refresh */}
      <FlatList
        style={styles.list}
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={() => navigation.navigate('ChallengeDetail', { challengeId: item.id })}
          />
        )}
        ListEmptyComponent={
          challengesLoading ? (
            <ActivityIndicator color={colors.accent} style={styles.emptySpinner} />
          ) : (
            <Text style={styles.emptyText}>No active challenges right now.</Text>
          )
        }
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.badgeGoldLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
    marginBottom: 12,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  emptySpinner: {
    marginTop: 40,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
