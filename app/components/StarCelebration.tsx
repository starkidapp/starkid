import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { t } from "@/lib/i18n";

const BURST = ['⭐', '✨', '🌟', '⭐', '✨', '🌟', '⭐', '✨'];
const BURST_RADIUS = 120;

export type Celebration = {
  /** Changes on every celebration so the animation replays. */
  id: number;
  stars: number;
  /** The whole task is finished — show the bigger "All done" message. */
  taskDone: boolean;
};

/**
 * Full-screen, non-blocking "you did it" animation: a big star pops in,
 * small stars burst outward and "+N ⭐" floats up. Fades out after ~1.6s.
 *
 * Once shown, the overlay stays mounted (invisible, opacity 0) instead of
 * unmounting: a remounted animated overlay never became visible again on the
 * new architecture, so only the kid's first mark used to celebrate.
 */
export default function StarCelebration({
  celebration,
  onDone,
}: {
  celebration: Celebration | null;
  onDone: () => void;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  // Keeps the last message on screen while it fades out after `celebration` clears.
  const [shown, setShown] = useState<Celebration | null>(null);

  useEffect(() => {
    if (!celebration) return;
    setShown(celebration);
    pop.setValue(0);
    burst.setValue(0);
    fade.setValue(1);

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.spring(pop, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
        Animated.timing(burst, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(celebration.taskDone ? 600 : 250),
      Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => {
      if (finished) onDone();
    });
    return () => animation.stop();
  }, [celebration, pop, burst, fade, onDone]);

  if (!shown) return null;

  const starScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const floatUp = burst.interpolate({ inputRange: [0, 1], outputRange: [20, -10] });

  return (
    <Animated.View pointerEvents="none" style={[styles.overlay, { opacity: fade }]}>
      <View style={styles.center}>
        {BURST.map((emoji, i) => {
          const angle = (i / BURST.length) * Math.PI * 2;
          const translateX = burst.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.cos(angle) * BURST_RADIUS],
          });
          const translateY = burst.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.sin(angle) * BURST_RADIUS],
          });
          const opacity = burst.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
          return (
            <Animated.Text
              key={i}
              style={[styles.spark, { opacity, transform: [{ translateX }, { translateY }] }]}
            >
              {emoji}
            </Animated.Text>
          );
        })}

        <Animated.Text style={[styles.bigStar, { transform: [{ scale: starScale }] }]}>
          {shown.taskDone ? '🏆' : '⭐'}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.pill, { transform: [{ translateY: floatUp }, { scale: starScale }] }]}>
        <AppText variant="title" color="#fff" align="center">
          {shown.taskDone ? t('celebration.all_done', { stars: shown.stars }) : `+${shown.stars} ⭐`}
        </AppText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute', fontSize: 30 },
  bigStar: { fontSize: 110, lineHeight: 130 },
  pill: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.success,
    ...shadows.lg,
  },
});
