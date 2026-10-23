import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, palette, shadows } from '@/constants/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, { box: number; font: number }> = {
  sm: { box: 40, font: 20 },
  md: { box: 58, font: 28 },
  lg: { box: 78, font: 40 },
  xl: { box: 104, font: 54 },
};

export interface AvatarProps {
  /** Emoji used as the avatar face. */
  emoji: string;
  size?: AvatarSize;
  selected?: boolean;
  /** Show a crown above the avatar (current challenge leader). */
  crowned?: boolean;
  onPress?: () => void;
  /** Absolutely-positioned badge nodes (e.g. <StarBadge/>) around the avatar. */
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomRight?: ReactNode;
  style?: ViewStyle;
}

export function Avatar({
  emoji,
  size = 'md',
  selected = false,
  crowned = false,
  onPress,
  topLeft,
  topRight,
  bottomRight,
  style,
}: AvatarProps) {
  const s = SIZES[size];

  const circle = (
    <View
      style={[
        styles.circle,
        {
          width: s.box,
          height: s.box,
          borderRadius: s.box / 2,
          borderColor: crowned ? palette.star : selected ? colors.accent : colors.border,
          backgroundColor: selected ? palette.accentSoft : palette.paperAlt,
        },
        style,
      ]}
    >
      <Text
        allowFontScaling={false}
        style={{
          fontSize: s.font,
          lineHeight: Math.round(s.font * 1.25),
          textAlign: 'center',
          includeFontPadding: false,
        }}
      >
        {emoji}
      </Text>
      {crowned ? (
        <View pointerEvents="none" style={[styles.crown, { top: -Math.round(s.box * 0.42) }]}>
          <Text
            allowFontScaling={false}
            style={[styles.crownText, { fontSize: Math.round(s.box * 0.42) }]}
          >
            👑
          </Text>
        </View>
      ) : null}
      {topLeft ? <View style={[styles.badge, styles.topLeft]}>{topLeft}</View> : null}
      {topRight ? <View style={[styles.badge, styles.topRight]}>{topRight}</View> : null}
      {bottomRight ? (
        <View style={[styles.badge, styles.bottomRight]}>{bottomRight}</View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
        {circle}
      </Pressable>
    );
  }
  return circle;
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'visible',
    ...shadows.sm,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
  badge: { position: 'absolute' },
  crown: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  crownText: { includeFontPadding: false, transform: [{ rotate: '-12deg' }] },
  topLeft: { top: -6, left: -6 },
  topRight: { top: -6, right: -6 },
  bottomRight: { bottom: -6, right: -6 },
});

export default Avatar;
