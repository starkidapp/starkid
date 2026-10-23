import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, palette, radii, shadows, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Add the hard "sticker" drop shadow. */
  playful?: boolean;
  /** Fire a selection haptic on press (default true). */
  haptic?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13, iconSize: 16 },
  md: { paddingVertical: 13, paddingHorizontal: 18, fontSize: 15, iconSize: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 22, fontSize: 17, iconSize: 20 },
};

const VARIANTS: Record<
  ButtonVariant,
  { bg: string; fg: string; border?: string; shadowColor?: string }
> = {
  primary: { bg: colors.primary, fg: colors.onPrimary, shadowColor: palette.primaryDark },
  secondary: { bg: colors.accent, fg: colors.onAccent, shadowColor: palette.accentDark },
  danger: { bg: colors.danger, fg: '#fff', shadowColor: '#C22E51' },
  ghost: { bg: 'transparent', fg: colors.primary, border: colors.primary },
  subtle: { bg: palette.primarySoft, fg: colors.primaryDark },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  playful = false,
  haptic = true,
  disabled,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  const handlePress = (e: GestureResponderEvent) => {
    if (haptic) {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 2 : 0,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        playful && v.shadowColor
          ? { ...shadows.playful, shadowColor: v.shadowColor }
          : null,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon ? (
            <Ionicons name={leftIcon} size={s.iconSize} color={v.fg} style={styles.iconLeft} />
          ) : null}
          <AppText variant="bodyStrong" weight="700" color={v.fg} style={{ fontSize: s.fontSize }}>
            {title}
          </AppText>
          {rightIcon ? (
            <Ionicons name={rightIcon} size={s.iconSize} color={v.fg} style={styles.iconRight} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.5 },
});

export default Button;
