import { ReactNode, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";

export class DismissibleController {
  private ignoreNextPressRef = false;

  /** Call from Modal.onShow to ignore the first overlay press */
  ignore() {
    this.ignoreNextPressRef = true;
  }

  /** Returns true if this press should be ignored (and resets the flag) */
  shouldIgnore(): boolean {
    if (this.ignoreNextPressRef) {
      this.ignoreNextPressRef = false;
      return true;
    }
    return false;
  }
}

/** Hook that creates a stable controller for coordinating Modal + DismissibleOverlay */
export function useDismissibleOverlay() {
  const controllerRef = useRef(new DismissibleController());
  return controllerRef.current;
}

interface DismissibleOverlayProps {
  children: ReactNode;
  onPress: () => void;
  controller: DismissibleController;
}

export function DismissibleOverlay({
  children,
  onPress,
  controller,
}: DismissibleOverlayProps) {
  return (
    <Pressable
      style={styles.overlay}
      onPress={() => {
        if (controller.shouldIgnore()) return;
        onPress();
      }}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26, 22, 20, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
