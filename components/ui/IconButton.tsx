import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GestureResponderEvent, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, palette, shadows } from '@/constants/theme';

export type IconButtonVariant = 'plain' | 'surface' | 'primary' | 'danger';

const VARIANTS: Record<IconButtonVariant, { bg: string; fg: string; shadow: boolean }> = {
  plain: { bg: 'transparent', fg: colors.text, shadow: false },
  surface: { bg: colors.card, fg: colors.text, shadow: true },
  primary: { bg: palette.primary, fg: colors.onPrimary, shadow: false },
  danger: { bg: palette.dangerSoft, fg: colors.danger, shadow: false },
};

export interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: IconButtonVariant;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
  haptic?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  variant = 'plain',
  size = 22,
  color,
  accessibilityLabel,
  haptic = true,
  disabled = false,
  style,
}: IconButtonProps) {
  const v = VARIANTS[variant];
  const box = size + 20;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={8}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.base,
        { width: box, height: box, borderRadius: box / 2, backgroundColor: v.bg },
        v.shadow && shadows.sm,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color ?? v.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.92 }] },
  disabled: { opacity: 0.4 },
});

export default IconButton;
