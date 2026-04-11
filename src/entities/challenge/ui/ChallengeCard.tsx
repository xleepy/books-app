import { StyleSheet, Text, View } from 'react-native';
import { Award, Calendar } from 'lucide-react-native';
import { colors, fontFamily } from '@shared/theme';
import { ProgressBar } from '@shared/ui';
import { Challenge } from '../model/types';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isMonthly = challenge.variant === 'monthly';
  const Icon = isMonthly ? Calendar : Award;

  const cardBg = isMonthly ? colors.challengeBlue : colors.bgCard;
  const titleColor = isMonthly ? colors.fontInverse : colors.fontPrimary;
  const subtitleColor = isMonthly ? '#FFFFFFB3' : colors.fontSecondary;
  const goalColor = isMonthly ? '#FFFFFFE6' : colors.fontSecondary;
  const counterColor = isMonthly ? colors.fontInverse : colors.fontPrimary;
  const iconBg = isMonthly ? '#3D6E9E' : colors.badgeGoldLight;
  const iconColor = isMonthly ? colors.fontInverse : colors.badgeGold;
  const badgeBg = isMonthly ? '#3D6E9E' : colors.badgeGoldLight;
  const badgeText = isMonthly ? colors.fontInverse : colors.badgeGold;
  const trackColor = isMonthly ? '#3D6E9E' : colors.bgSecondary;
  const fillColor = isMonthly ? colors.fontInverse : colors.badgeGold;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: cardBg },
        !isMonthly && styles.cardBorder,
      ]}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
            <Icon size={20} color={iconColor} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: titleColor }]}>{challenge.title}</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>
              {challenge.subtitle}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeText }]}>{challenge.badgeText}</Text>
        </View>
      </View>
      <View style={styles.goalWrap}>
        <View style={styles.goalRow}>
          <Text style={[styles.goalText, { color: goalColor }]}>{challenge.goal}</Text>
          <Text style={[styles.counter, { color: counterColor }]}>
            {challenge.current} / {challenge.target}
          </Text>
        </View>
        <ProgressBar
          value={challenge.current / challenge.target}
          height={8}
          trackColor={trackColor}
          fillColor={fillColor}
        />
      </View>
    </View>
  );
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
});
