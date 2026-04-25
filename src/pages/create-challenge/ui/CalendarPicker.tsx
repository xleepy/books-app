import { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

type CalendarPickerProps = {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type CalendarPickerBodyProps = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
};

function CalendarPickerBody({
  selectedDate,
  onSelect,
  onClose,
  minimumDate,
}: CalendarPickerBodyProps) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayPress = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (minimumDate) {
      const min = new Date(
        minimumDate.getFullYear(),
        minimumDate.getMonth(),
        minimumDate.getDate(),
      );
      if (date < min) return;
    }
    onSelect(date);
    onClose();
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!minimumDate) return false;
    const date = new Date(viewYear, viewMonth, day);
    const min = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      minimumDate.getDate(),
    );
    return date < min;
  };

  return (
    <Pressable
      testID="calendar-overlay"
      style={styles.overlay}
      onPress={onClose}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Pressable onPress={prevMonth} style={styles.arrowBtn}>
            <ChevronLeft size={20} color={colors.fontSecondary} />
          </Pressable>
          <Text style={styles.monthText}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
          <Pressable onPress={nextMonth} style={styles.arrowBtn}>
            <ChevronRight size={20} color={colors.fontSecondary} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {WEEK_DAYS.map((d, i) => (
            <Text key={i} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {days.map((day) => {
            const selected = isSelected(day);
            const disabled = isDisabled(day);
            return (
              <Pressable
                key={day}
                style={[styles.dayCell, selected && styles.dayCellSelected]}
                onPress={() => handleDayPress(day)}
                disabled={disabled}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.dayTextSelected,
                    disabled && styles.dayTextDisabled,
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}

export function CalendarPicker({
  visible,
  selectedDate,
  onSelect,
  onClose,
  minimumDate,
}: CalendarPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {visible && (
        <CalendarPickerBody
          selectedDate={selectedDate}
          onSelect={onSelect}
          onClose={onClose}
          minimumDate={minimumDate}
        />
      )}
    </Modal>
  );
}

const DAY_CELL_SIZE = 36;
const DAY_MARGIN = 2;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26, 22, 20, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    width: (DAY_CELL_SIZE + DAY_MARGIN * 2) * 7 + 20 * 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  arrowBtn: {
    padding: 4,
  },
  monthText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.fontTertiary,
    width: DAY_CELL_SIZE,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    margin: DAY_MARGIN,
    borderRadius: DAY_CELL_SIZE / 2,
  },
  dayCellSelected: {
    backgroundColor: colors.accent,
  },
  dayText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  dayTextSelected: {
    fontFamily: fontFamily.semibold,
    color: colors.fontInverse,
  },
  dayTextDisabled: {
    color: colors.fontTertiary,
  },
});
