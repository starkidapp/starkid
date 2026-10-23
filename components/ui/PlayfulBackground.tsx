import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { palette } from '@/constants/theme';

type Bubble = {
  size: number;
  color: string;
  /** Outlined ring instead of a filled circle. */
  ring?: boolean;
  /** Offsets in percent of the container, so it scales to any screen. */
  top?: `${number}%`;
  bottom?: `${number}%`;
  left?: `${number}%`;
  right?: `${number}%`;
  /** Drifts up and down gently. */
  float?: boolean;
};

const BUBBLES: Bubble[] = [
  { size: 220, color: 'rgba(108, 99, 255, 0.10)', top: '-6%', left: '-22%', float: true },
  { size: 160, color: 'rgba(251, 133, 0, 0.10)', top: '14%', right: '-18%', float: true },
  { size: 120, color: 'rgba(6, 214, 160, 0.12)', top: '44%', left: '-14%' },
  { size: 200, color: 'rgba(58, 160, 255, 0.10)', bottom: '-6%', right: '-20%', float: true },
  { size: 140, color: 'rgba(239, 71, 111, 0.09)', bottom: '18%', left: '-12%', float: true },
  { size: 90, color: 'rgba(108, 99, 255, 0.22)', ring: true, top: '8%', right: '22%' },
  { size: 64, color: 'rgba(251, 133, 0, 0.28)', ring: true, top: '36%', right: '6%', float: true },
  { size: 110, color: 'rgba(6, 214, 160, 0.24)', ring: true, bottom: '30%', right: '30%' },
  { size: 50, color: 'rgba(239, 71, 111, 0.26)', ring: true, bottom: '8%', left: '28%', float: true },
  // Small confetti dots
  { size: 14, color: 'rgba(255, 201, 60, 0.75)', top: '6%', left: '46%' },
  { size: 10, color: 'rgba(108, 99, 255, 0.45)', top: '26%', left: '12%' },
  { size: 12, color: 'rgba(6, 214, 160, 0.55)', top: '58%', right: '14%' },
  { size: 9, color: 'rgba(239, 71, 111, 0.5)', top: '72%', left: '20%' },
  { size: 16, color: 'rgba(255, 201, 60, 0.7)', bottom: '12%', right: '10%' },
  { size: 11, color: 'rgba(58, 160, 255, 0.5)', bottom: '40%', left: '52%' },
];

export interface PlayfulBackgroundProps {
  /** Base colour behind the bubbles. */
  color?: string;
  style?: ViewStyle;
}

/**
 * Decorative layer of soft colourful circles, rings and confetti dots for the
 * kids' screens. Place it first inside a full-screen container; it ignores touches.
 */
export function PlayfulBackground({ color = palette.paper, style }: PlayfulBackgroundProps) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const up = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const down = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: color }, style]}>
      {BUBBLES.map(({ size, color: c, ring, float, ...pos }, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bubble,
            pos,
            { width: size, height: size, borderRadius: size / 2 },
            ring
              ? { borderWidth: Math.max(3, size / 14), borderColor: c }
              : { backgroundColor: c },
            float ? { transform: [{ translateY: i % 2 ? up : down }] } : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { position: 'absolute' },
});

export default PlayfulBackground;
