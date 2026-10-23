import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, palette, radii, shadows, spacing, ShadowToken } from '@/constants/theme';

export type CardTone = 'plain' | 'primary' | 'accent' | 'success' | 'danger' | 'star' | 'info';

const TONES: Record<CardTone, { bg: string; bar: string }> = {
  plain: { bg: colors.card, bar: 'transparent' },
  primary: { bg: palette.primarySoft, bar: palette.primary },
  accent: { bg: palette.accentSoft, bar: palette.accent },
  success: { bg: palette.successSoft, bar: palette.success },
  danger: { bg: palette.dangerSoft, bar: palette.danger },
  star: { bg: palette.starSoft, bar: palette.star },
  info: { bg: palette.infoSoft, bar: palette.info },
};

export interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  /** Show the coloured left accent bar (only meaningful for tinted tones). */
  accentBar?: boolean;
  padding?: keyof typeof spacing | number | 'none';
  shadow?: ShadowToken | 'none';
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  tone = 'plain',
  accentBar = false,
  padding = 'lg',
  shadow = 'md',
  onPress,
  style,
}: CardProps) {
  const t = TONES[tone];
  const pad =
    padding === 'none' ? 0 : typeof padding === 'number' ? padding : spacing[padding];

  const content = (
    <View
      style={[
        styles.base,
        { backgroundColor: t.bg, padding: pad },
        shadow !== 'none' && tone === 'plain' ? shadows[shadow] : null,
        accentBar && t.bar !== 'transparent'
          ? { borderLeftWidth: 4, borderLeftColor: t.bar }
          : null,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.lg },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});

export default Card;
