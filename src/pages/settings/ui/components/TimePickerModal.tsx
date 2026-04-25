import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { DismissibleOverlay, useDismissibleOverlay } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";

interface TimePickerModalProps {
  visible: boolean;
  initialTime: string; // "HH:mm"
  onSelect: (time: string) => void;
  onClose: () => void;
}

function parseTime(time: string): [number, number] {
  const [h, m] = time.split(":");
  return [parseInt(h ?? "21", 10), parseInt(m ?? "0", 10)];
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

type TimePickerBodyProps = {
  initialTime: string;
  onSelect: (time: string) => void;
  onClose: () => void;
};

function TimePickerBody({
  initialTime,
  onSelect,
  onClose,
}: TimePickerBodyProps) {
  const [h, m] = parseTime(initialTime);
  const [hour, setHour] = useState(h);
  const [minute, setMinute] = useState(m);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

  const handleHourChange = (delta: number) => {
    setHour((prev) => (prev + delta + 24) % 24);
  };

  const handleMinuteChange = (delta: number) => {
    setMinute((prev) => (prev + delta + 60) % 60);
  };

  const handleConfirm = () => {
    onSelect(formatTime(hour, minute));
    onClose();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reading Reminder</Text>

      <View style={styles.displayRow}>
        <View style={styles.displayBlock}>
          <Text style={styles.displayValue}>
            {String(hour).padStart(2, "0")}
          </Text>
          <Text style={styles.displayLabel}>Hour</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.displayBlock}>
          <Text style={styles.displayValue}>
            {String(minute).padStart(2, "0")}
          </Text>
          <Text style={styles.displayLabel}>Minute</Text>
        </View>
      </View>

      <View style={styles.pickerRow}>
        {/* Hour picker */}
        <View style={styles.pickerColumn}>
          <Pressable style={styles.stepBtn} onPress={() => handleHourChange(1)}>
            <Text style={styles.stepBtnText}>+</Text>
          </Pressable>
          <ScrollView
            style={styles.wheel}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.wheelContent}
          >
            {hours.map((h) => {
              const selected = h === hour;
              return (
                <Pressable
                  key={h}
                  onPress={() => setHour(h)}
                  style={[
                    styles.wheelItem,
                    selected && styles.wheelItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.wheelItemText,
                      selected && styles.wheelItemTextSelected,
                    ]}
                  >
                    {String(h).padStart(2, "0")}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            style={styles.stepBtn}
            onPress={() => handleHourChange(-1)}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </Pressable>
        </View>

        {/* Minute picker */}
        <View style={styles.pickerColumn}>
          <Pressable
            style={styles.stepBtn}
            onPress={() => handleMinuteChange(5)}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </Pressable>
          <ScrollView
            style={styles.wheel}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.wheelContent}
          >
            {minutes.map((m) => {
              const selected = m === minute;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMinute(m)}
                  style={[
                    styles.wheelItem,
                    selected && styles.wheelItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.wheelItemText,
                      selected && styles.wheelItemTextSelected,
                    ]}
                  >
                    {String(m).padStart(2, "0")}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            style={styles.stepBtn}
            onPress={() => handleMinuteChange(-5)}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Set Reminder</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TimePickerModal({
  visible,
  initialTime,
  onSelect,
  onClose,
}: TimePickerModalProps) {
  const overlay = useDismissibleOverlay();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => overlay.ignore()}
    >
      <DismissibleOverlay controller={overlay} onPress={onClose}>
        {visible && (
          <TimePickerBody
            initialTime={initialTime}
            onSelect={onSelect}
            onClose={onClose}
          />
        )}
      </DismissibleOverlay>
    </Modal>
  );
}

const WHEEL_ITEM_HEIGHT = 40;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    width: 300,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  displayBlock: {
    alignItems: "center",
  },
  displayValue: {
    fontFamily: fontFamily.bold,
    fontSize: 36,
    color: colors.accent,
    minWidth: 56,
    textAlign: "center",
  },
  displayLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.fontTertiary,
    marginTop: 2,
  },
  colon: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: colors.fontSecondary,
    paddingBottom: 14,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 24,
  },
  pickerColumn: {
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  wheel: {
    height: WHEEL_ITEM_HEIGHT * 3,
    width: 64,
  },
  wheelContent: {
    paddingVertical: WHEEL_ITEM_HEIGHT,
  },
  wheelItem: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  wheelItemSelected: {
    backgroundColor: colors.accentLight,
  },
  wheelItemText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.fontSecondary,
  },
  wheelItemTextSelected: {
    fontFamily: fontFamily.semibold,
    color: colors.accent,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
  },
  cancelBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontPrimary,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  confirmBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontInverse,
  },
});
