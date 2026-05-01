import { StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface StreakCardProps {
  streak: number;
  bestStreak: number;
  weekDays: boolean[];
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function getIsoWeekday(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Mon=0, Tue=1, ... Sun=6
}

export function StreakCard({ streak, bestStreak, weekDays }: StreakCardProps) {
  const todayIso = getIsoWeekday();

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Flame
            size={20}
            color={colors.streakOrange}
            fill={colors.streakOrange}
          />
          <Text style={styles.title}>{streak} Day Streak</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Best: {bestStreak}</Text>
        </View>
      </View>
      <View style={styles.daysRow}>
        {DAY_LABELS.map((label, i) => {
          const isFilled = weekDays[i];
          const isToday = i === todayIso;
          return (
            <View key={i} style={styles.dayCol}>
              <View
                style={[
                  styles.dayCircle,
                  isFilled && styles.dayCircleFilled,
                  isToday && styles.dayCircleToday,
                  !isFilled && !isToday && styles.dayCircleEmpty,
                ]}
              />
              <Text style={styles.dayLabel}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  badge: {
    backgroundColor: colors.streakOrangeLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 24,
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: colors.streakOrange,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  dayCircleFilled: {
    backgroundColor: colors.streakOrange,
  },
  dayCircleToday: {
    backgroundColor: colors.streakOrangeLight,
    borderWidth: 2,
    borderColor: colors.streakOrange,
  },
  dayCircleEmpty: {
    backgroundColor: colors.bgSecondary,
  },
  dayLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    color: colors.fontTertiary,
  },
});
