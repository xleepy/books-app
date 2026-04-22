import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Award,
  Flame,
  BookOpen,
  Users,
} from 'lucide-react-native';
import {
  useGetChallengesByIdQuery,
  useGetChallengesByIdLeaderboardQuery,
  usePostChallengesByIdJoinMutation,
  usePostChallengesByIdLeaveMutation,
  useDeleteChallengesByIdMutation,
} from '@shared/api/challengesApi.generated';
import { ProgressBar } from '@shared/ui';
import { colors, fontFamily } from '@shared/theme';
import { RootStackParamList } from '@app/navigation/types';
import { LeaderboardSection } from '@widgets/leaderboard/ui/LeaderboardSection';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ChallengeDetail'>;

const metricIcons: Record<string, typeof Calendar> = {
  books: BookOpen,
  pages: BookOpen,
  hours: Calendar,
  streak: Flame,
};

const variantColors: Record<string, string> = {
  monthly: colors.challengeBlue,
  yearly: colors.badgeGold,
  weekly: colors.streakOrange,
  custom: colors.xpPurple,
};

export function ChallengeDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const {
    data: challengeData,
    isLoading: challengeLoading,
    refetch: refetchChallenge,
  } = useGetChallengesByIdQuery(params.challengeId, { refetchOnMountOrArgChange: true });
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    refetch: refetchLeaderboard,
  } = useGetChallengesByIdLeaderboardQuery({ id: params.challengeId }, { refetchOnMountOrArgChange: true });


  const [joinChallenge, { isLoading: isJoining }] = usePostChallengesByIdJoinMutation();
  const [leaveChallenge, { isLoading: isLeaving }] = usePostChallengesByIdLeaveMutation();
  const [deleteChallenge, { isLoading: isDeleting }] = useDeleteChallengesByIdMutation();

  const challenge = challengeData?.data;
  const leaderboard = leaderboardData?.data ?? [];

  const isLoading = challengeLoading || leaderboardLoading;

  async function handleJoin() {
    if (!challenge) return;
    try {
      await joinChallenge(challenge.id).unwrap();
      refetchChallenge();
      refetchLeaderboard();
    } catch {
      Alert.alert('Error', 'Failed to join challenge. Please try again.');
    }
  }

  async function handleLeave() {
    if (!challenge) return;
    try {
      await leaveChallenge(challenge.id).unwrap();
      refetchChallenge();
      refetchLeaderboard();
    } catch {
      Alert.alert('Error', 'Failed to leave challenge. Please try again.');
    }
  }

  function handleCancel() {
    if (!challenge) return;
    Alert.alert(
      'Cancel Challenge',
      'Are you sure you want to cancel this challenge? All participants will be removed.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Challenge',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChallenge(challenge.id).unwrap();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to cancel challenge. Please try again.');
            }
          },
        },
      ]
    );
  }

  function getActionButton() {
    if (!challenge) return null;
    if (challenge.isCreator) {
      return (
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.accentRed }]}
          onPress={handleCancel}
          disabled={isDeleting}
        >
          <Text style={styles.actionBtnText}>
            {isDeleting ? 'Cancelling...' : 'Cancel Challenge'}
          </Text>
        </Pressable>
      );
    }
    if (challenge.isJoined) {
      return (
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.fontTertiary }]}
          onPress={handleLeave}
          disabled={isLeaving}
        >
          <Text style={styles.actionBtnText}>
            {isLeaving ? 'Leaving...' : 'Leave Challenge'}
          </Text>
        </Pressable>
      );
    }
    return (
      <Pressable
        style={[styles.actionBtn, { backgroundColor: colors.accent }]}
        onPress={handleJoin}
        disabled={isJoining}
      >
        <Text style={styles.actionBtnText}>
          {isJoining ? 'Joining...' : 'Join Challenge'}
        </Text>
      </Pressable>
    );
  }

  if (isLoading || !challenge) {
    return (
      <View style={[styles.loadingWrap, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const cardColor = variantColors[challenge.variant] ?? colors.challengeBlue;
  const MetricIcon = metricIcons[challenge.metric] ?? BookOpen;
  const progress = challenge.target > 0 ? (challenge.current ?? 0) / challenge.target : 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.fontPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Challenge Details</Text>
        <Pressable style={styles.shareBtn}>
          <Share2 size={20} color={colors.fontPrimary} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: cardColor }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                <MetricIcon size={24} color={colors.fontInverse} />
              </View>
              <View style={styles.heroTitleWrap}>
                <Text style={styles.heroTitle}>{challenge.title}</Text>
                <Text style={styles.heroSubtitle}>
                  {challenge.variant.charAt(0).toUpperCase() + challenge.variant.slice(1)} Challenge
                </Text>
              </View>
            </View>
            <Text style={styles.heroBadge}>{challenge.badgeText}</Text>
          </View>

          {challenge.description && (
            <Text style={styles.heroDesc}>{challenge.description}</Text>
          )}

          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Creator</Text>
              <Text style={styles.metaValue}>{challenge.creatorName ?? 'Books App'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Participants</Text>
              <Text style={styles.metaValue}>{challenge.participantCount.toLocaleString()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Ends</Text>
              <Text style={styles.metaValue}>
                {challenge.activeTo ? new Date(challenge.activeTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        {challenge.isJoined && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressCounter}>
                {challenge.current ?? 0} / {challenge.target} {challenge.metric}
              </Text>
            </View>
            <ProgressBar
              value={progress}
              height={8}
              trackColor={colors.bgSecondary}
              fillColor={cardColor}
            />
            <View style={styles.progressMeta}>
              <Text style={styles.progressMetaText}>
                {challenge.activeFrom ? `Started ${new Date(challenge.activeFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
              </Text>
              <Text style={styles.progressMetaText}>{Math.round(progress * 100)}% complete</Text>
            </View>
          </View>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && <LeaderboardSection entries={leaderboard} />}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {getActionButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.bgPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    color: colors.fontPrimary,
  },
  shareBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 8,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitleWrap: {
    gap: 2,
  },
  heroTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontInverse,
  },
  heroSubtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  heroBadge: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.fontInverse,
  },
  heroDesc: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  metaValue: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.fontInverse,
  },
  progressCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  progressCounter: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.accent,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressMetaText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.bgPrimary,
  },
  actionBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontInverse,
  },
});
