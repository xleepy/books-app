import { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { DismissibleOverlay, useDismissibleOverlay } from "@shared/ui";
import { colors, fontFamily } from "@shared/theme";

interface GoalPickerModalProps {
  visible: boolean;
  initialMinutes: number;
  onSelect: (minutes: number) => void;
  onClose: () => void;
}

export function GoalPickerModal({
  visible,
  initialMinutes,
  onSelect,
  onClose,
}: GoalPickerModalProps) {
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
          <GoalPickerBody
            initialMinutes={initialMinutes}
            onSelect={onSelect}
            onClose={onClose}
          />
        )}
      </DismissibleOverlay>
    </Modal>
  );
}

interface GoalPickerBodyProps {
  initialMinutes: number;
  onSelect: (minutes: number) => void;
  onClose: () => void;
}

const PRESETS = [15, 30, 45, 60];

function GoalPickerBody({
  initialMinutes,
  onSelect,
  onClose,
}: GoalPickerBodyProps) {
  const [minutes, setMinutes] = useState(initialMinutes);

  function adjust(delta: number) {
    setMinutes((prev) => Math.max(5, Math.min(180, prev + delta)));
  }

  function handleSave() {
    onSelect(minutes);
    onClose();
  }

  return (
    <View style={styles.card} onStartShouldSetResponder={() => true}>
      <Text style={styles.title}>Daily Reading Goal</Text>
      <Text style={styles.subtitle}>
        How many minutes do you want to read each day?
      </Text>

      <View style={styles.displayRow}>
        <Pressable
          style={styles.stepBtn}
          onPress={() => adjust(-5)}
          hitSlop={8}
        >
          <Minus size={20} color={colors.fontPrimary} />
        </Pressable>

        <View style={styles.valueBlock}>
          <Text style={styles.valueNum}>{minutes}</Text>
          <Text style={styles.valueLabel}>minutes</Text>
        </View>

        <Pressable style={styles.stepBtn} onPress={() => adjust(5)} hitSlop={8}>
          <Plus size={20} color={colors.fontPrimary} />
        </Pressable>
      </View>

      <View style={styles.chipsRow}>
        {PRESETS.map((preset) => {
          const active = preset === minutes;
          return (
            <Pressable
              key={preset}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setMinutes(preset)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {preset} min
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    width: 320,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 20,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontSecondary,
    textAlign: "center",
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  valueBlock: {
    alignItems: "center",
    gap: 2,
  },
  valueNum: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    color: colors.accent,
    minWidth: 80,
    textAlign: "center",
  },
  valueLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.fontSecondary,
  },
  chipsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.accent,
  },
  chipTextActive: {
    color: colors.fontInverse,
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
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontInverse,
  },
});
