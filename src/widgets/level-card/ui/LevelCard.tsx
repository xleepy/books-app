import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { ProgressBar } from '@shared/ui';
import { User } from '@entities/user/model/types';

interface LevelCardProps {
  user: User;
}

export function LevelCard({ user }: LevelCardProps) {
  const progress = user.xpCurrent / user.xpRequired;
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeNumber}>{user.level}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Level {user.level}</Text>
        <Text style={styles.subtitle}>{user.levelTitle}</Text>
        <View style={styles.barWrap}>
          <ProgressBar
            value={progress}
            height={8}
            trackColor="#5A3E99"
            fillColor={colors.fontInverse}
          />
          <Text style={styles.xpText}>
            {user.xpCurrent.toLocaleString()} / {user.xpRequired.toLocaleString()} XP
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.xpPurple,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.xpPurpleLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeNumber: {
    fontFamily: fontFamily.extrabold,
    fontSize: 24,
    color: colors.xpPurple,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontInverse,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontInverse,
    opacity: 0.8,
  },
  barWrap: {
    gap: 6,
    marginTop: 4,
  },
  xpText: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.fontInverse,
    opacity: 0.7,
  },
});
