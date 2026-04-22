import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Award, Calendar, Flame, BookOpen, Users } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { ProgressBar } from '@shared/ui';
import { Challenge } from '../model/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
}

const variantConfig: Record<string, { bg: string; iconBg: string; iconColor: string; badgeBg: string; badgeText: string; track: string; fill: string; title: string; subtitle: string; goal: string; counter: string }> = {
  monthly: {
    bg: colors.challengeBlue,
    iconBg: '#3D6E9E',
    iconColor: colors.fontInverse,
    badgeBg: '#3D6E9E',
    badgeText: colors.fontInverse,
    track: '#3D6E9E',
    fill: colors.fontInverse,
    title: colors.fontInverse,
    subtitle: '#FFFFFFB3',
    goal: '#FFFFFFE6',
    counter: colors.fontInverse,
  },
  yearly: {
    bg: colors.badgeGoldLight,
    iconBg: colors.badgeGold,
    iconColor: colors.fontInverse,
    badgeBg: colors.badgeGold,
    badgeText: colors.fontInverse,
    track: colors.bgSecondary,
    fill: colors.badgeGold,
    title: colors.fontPrimary,
    subtitle: colors.fontSecondary,
    goal: colors.fontSecondary,
    counter: colors.fontPrimary,
  },
  weekly: {
    bg: colors.streakOrangeLight,
    iconBg: colors.streakOrange,
    iconColor: colors.fontInverse,
    badgeBg: colors.streakOrange,
    badgeText: colors.fontInverse,
    track: colors.bgSecondary,
    fill: colors.streakOrange,
    title: colors.fontPrimary,
    subtitle: colors.fontSecondary,
    goal: colors.fontSecondary,
    counter: colors.fontPrimary,
  },
  custom: {
    bg: colors.xpPurpleLight,
    iconBg: colors.xpPurple,
    iconColor: colors.fontInverse,
    badgeBg: colors.xpPurple,
    badgeText: colors.fontInverse,
    track: colors.bgSecondary,
    fill: colors.xpPurple,
    title: colors.fontPrimary,
    subtitle: colors.fontSecondary,
    goal: colors.fontSecondary,
    counter: colors.fontPrimary,
  },
};

const metricIcons: Record<string, typeof Calendar> = {
  books: BookOpen,
  pages: BookOpen,
  hours: Calendar,
  streak: Flame,
};

export function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const config = variantConfig[challenge.variant] ?? variantConfig.custom;
  const Icon = metricIcons[challenge.metric] ?? BookOpen;
  const progress = challenge.target > 0 ? (challenge.current ?? 0) / challenge.target : 0;

  const cardContent = (
    <View
      style={[
        styles.card,
        { backgroundColor: config.bg },
        challenge.variant !== 'monthly' && styles.cardBorder,
      ]}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
            <Icon size={20} color={config.iconColor} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: config.title }]}>{challenge.title}</Text>
            <Text style={[styles.subtitle, { color: config.subtitle }]}>
              {challenge.variant.charAt(0).toUpperCase() + challenge.variant.slice(1)} Challenge
              {challenge.metric !== 'books' ? ` • ${challenge.metric.charAt(0).toUpperCase() + challenge.metric.slice(1)}` : ''}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
          <Text style={[styles.badgeText, { color: config.badgeText }]}>{challenge.badgeText}</Text>
        </View>
      </View>
      <View style={styles.goalWrap}>
        <View style={styles.goalRow}>
          <Text style={[styles.goalText, { color: config.goal }]}>
            Read {challenge.target} {challenge.metric}
          </Text>
          <Text style={[styles.counter, { color: config.counter }]}>
            {challenge.current ?? 0} / {challenge.target}
          </Text>
        </View>
        <ProgressBar
          value={progress}
          height={8}
          trackColor={config.track}
          fillColor={config.fill}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.participants}>
          <Users size={12} color={config.subtitle} />
          <Text style={[styles.participantsText, { color: config.subtitle }]}>
            {challenge.participantCount.toLocaleString()} participants
          </Text>
        </View>
        {challenge.isCreator && (
          <Text style={[styles.creatorBadge, { color: config.counter }]}>Created by you</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    gap: 2,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  badge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
  },
  goalWrap: {
    gap: 8,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  counter: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
  },
  creatorBadge: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
  },
});
