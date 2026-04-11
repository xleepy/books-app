import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { Avatar } from '@shared/ui';
import { LeaderboardEntry } from '../model/types';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const isFirst = entry.rank === 1;
  const isThird = entry.rank === 3;

  const cardBg = isFirst ? colors.badgeGoldLight : isThird ? colors.bgCard : colors.bgSecondary;
  const cardBorder = isFirst
    ? colors.badgeGold
    : isThird
      ? colors.borderLight
      : 'transparent';
  const rankBg = isFirst
    ? colors.badgeGold
    : entry.rank === 2
      ? colors.fontTertiary
      : colors.accentLight;
  const rankColor = isFirst || entry.rank === 2 ? colors.fontInverse : colors.accent;
  const nameColor = entry.isYou ? colors.accent : colors.fontPrimary;
  const booksColor = isFirst ? colors.badgeGold : colors.fontPrimary;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: cardBg, borderColor: cardBorder, borderWidth: cardBorder === 'transparent' ? 0 : 1 },
      ]}
    >
      <View style={[styles.rank, { backgroundColor: rankBg }]}>
        <Text style={[styles.rankText, { color: rankColor }]}>{entry.rank}</Text>
      </View>
      <Avatar
        initials={entry.name[0]}
        size={36}
        hue={entry.avatarHue}
      />
      <View style={styles.nameWrap}>
        <Text style={[styles.name, { color: nameColor }]}>{entry.name}</Text>
        <Text style={styles.level}>
          Level {entry.level} · {entry.levelTitle}
        </Text>
      </View>
      <View style={styles.scoreWrap}>
        <Text style={[styles.books, { color: booksColor }]}>{entry.books} books</Text>
        <Text style={styles.xp}>{entry.xp.toLocaleString()} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontFamily: fontFamily.extrabold,
    fontSize: 14,
  },
  nameWrap: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
  },
  level: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontSecondary,
  },
  scoreWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  books: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  xp: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontSecondary,
  },
});
