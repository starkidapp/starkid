import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'success' | 'danger' | 'star' | 'warning';

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: palette.cloud, fg: palette.ink },
  primary: { bg: palette.primarySoft, fg: palette.primaryDark },
  accent: { bg: palette.accentSoft, fg: palette.accentDark },
  success: { bg: palette.successSoft, fg: '#02795B' },
  danger: { bg: palette.dangerSoft, fg: '#C22E51' },
  star: { bg: palette.star, fg: '#5C4300' },
  warning: { bg: palette.warningSoft, fg: '#8A5B00' },
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ children, tone = 'neutral', size = 'md', style }: BadgeProps) {
  const t = TONES[tone];
  const pad =
    size === 'sm'
      ? { paddingHorizontal: spacing.sm, paddingVertical: 2 }
      : { paddingHorizontal: spacing.md, paddingVertical: spacing.xs };

  return (
    <View style={[styles.base, pad, { backgroundColor: t.bg }, style]}>
      <AppText variant={size === 'sm' ? 'caption' : 'label'} color={t.fg}>
        {children}
      </AppText>
    </View>
  );
}

export interface StarBadgeProps {
  count: number;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  /** Prefix with a sign, e.g. `+3 ⭐` / `-1 ⭐`. */
  signed?: boolean;
  style?: ViewStyle;
}

/** Convenience badge for star counts. */
export function StarBadge({ count, tone = 'star', size = 'md', signed = false, style }: StarBadgeProps) {
  const sign = signed && count > 0 ? '+' : '';
  return (
    <Badge tone={tone} size={size} style={style}>
      {`${sign}${count} ⭐`}
    </Badge>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Badge;
