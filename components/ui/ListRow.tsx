import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, palette, radii, spacing } from '@/constants/theme';
import { AppText } from './AppText';

type IconTone = 'primary' | 'accent' | 'success' | 'danger' | 'info' | 'star' | 'neutral';

const ICON_TONES: Record<IconTone, { bg: string; fg: string }> = {
  primary: { bg: palette.primarySoft, fg: palette.primary },
  accent: { bg: palette.accentSoft, fg: palette.accentDark },
  success: { bg: palette.successSoft, fg: '#02795B' },
  danger: { bg: palette.dangerSoft, fg: '#C22E51' },
  info: { bg: palette.infoSoft, fg: palette.info },
  star: { bg: palette.starSoft, fg: '#8A5B00' },
  neutral: { bg: palette.cloud, fg: palette.slate },
};

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Ionicons name, or an emoji string for a playful look. */
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  iconTone?: IconTone;
  onPress?: () => void;
  showChevron?: boolean;
  style?: ViewStyle;
}

export function ListRow({
  title,
  subtitle,
  icon,
  emoji,
  iconTone = 'primary',
  onPress,
  showChevron = true,
  style,
}: ListRowProps) {
  const tone = ICON_TONES[iconTone];

  const inner = (
    <>
      {(icon || emoji) && (
        <View style={[styles.iconTile, { backgroundColor: tone.bg }]}>
          {emoji ? (
            <AppText style={styles.emoji}>{emoji}</AppText>
          ) : (
            <Ionicons name={icon!} size={20} color={tone.fg} />
          )}
        </View>
      )}
      <View style={styles.textCol}>
        <AppText variant="bodyStrong">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {onPress && showChevron ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={[styles.row, style]}>{inner}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  textCol: { flex: 1 },
  subtitle: { marginTop: 2 },
});

export default ListRow;
