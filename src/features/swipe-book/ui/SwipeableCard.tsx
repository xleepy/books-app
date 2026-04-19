import { ReactNode } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontFamily } from '@shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, onTap }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reset = () => {
    translateX.value = 0;
    translateY.value = 0;
  };

  const handleSwipeLeft = () => {
    onSwipeLeft?.();
    reset();
  };

  const handleSwipeRight = () => {
    onSwipeRight?.();
    reset();
  };

  const handleTap = () => {
    onTap?.();
  };

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(handleTap)();
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.5;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(handleSwipeRight)();
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(handleSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const composed = Gesture.Race(tap, pan);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-12, 0, 12]);
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD, SCREEN_WIDTH],
      [1, 0.95, 0.4],
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], 'clamp'),
  }));

  const discardOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], 'clamp'),
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {children}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlayLike, likeOverlayStyle]}>
          <View style={styles.labelLike}>
            <Text style={[styles.labelText, styles.labelTextLike]}>LIKE</Text>
          </View>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlayDiscard, discardOverlayStyle]}>
          <View style={styles.labelDiscard}>
            <Text style={[styles.labelText, styles.labelTextDiscard]}>NOPE</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlayLike: {
    backgroundColor: 'rgba(74, 124, 89, 0.35)',
  },
  overlayDiscard: {
    backgroundColor: 'rgba(196, 75, 75, 0.35)',
  },
  labelLike: {
    position: 'absolute',
    top: 36,
    left: 24,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: colors.accentGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    transform: [{ rotate: '-15deg' }],
  },
  labelDiscard: {
    position: 'absolute',
    top: 36,
    right: 24,
    borderWidth: 3,
    borderRadius: 8,
    borderColor: colors.accentRed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    transform: [{ rotate: '15deg' }],
  },
  labelText: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    letterSpacing: 2,
  },
  labelTextLike: {
    color: colors.accentGreen,
  },
  labelTextDiscard: {
    color: colors.accentRed,
  },
});
