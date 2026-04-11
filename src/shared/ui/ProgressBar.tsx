import { StyleSheet, View } from 'react-native';
import { colors } from '@shared/theme';

interface ProgressBarProps {
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBar({
  value,
  height = 6,
  trackColor = colors.bgSecondary,
  fillColor = colors.accent,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            width: `${pct * 100}%`,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});
