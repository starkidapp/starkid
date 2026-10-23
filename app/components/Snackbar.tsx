import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { AppText } from '@/components/ui';
import { palette, radii, shadows, spacing } from '@/constants/theme';

export default function Snackbar({
  visible,
  message,
  actionLabel,
  onAction,
  onHide,
}: {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onHide?: () => void;
}) {
  const translateY = React.useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
      const t = setTimeout(() => {
        onHide && onHide();
      }, 4500);
      return () => clearTimeout(t);
    }
    Animated.timing(translateY, {
      toValue: 80,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <AppText variant="body" color="#fff" style={styles.message}>
        {message}
      </AppText>
      {actionLabel ? (
        <Pressable
          onPress={() => {
            onAction && onAction();
            onHide && onHide();
          }}
          hitSlop={8}
        >
          <AppText variant="label" color={palette.star}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: palette.ink,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    zIndex: 1000,
    ...shadows.lg,
  },
  message: { flex: 1 },
});
