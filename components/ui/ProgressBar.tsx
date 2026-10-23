import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, palette, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface ProgressBarProps {
  /** 0–1. Ignored if `value`/`total` are given. */
  progress?: number;
  value?: number;
  total?: number;
  color?: string;
  /** Show a `2/5 done` style label above the track. */
  label?: string | boolean;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  value,
  total,
  color = palette.primary,
  label,
  height = 8,
  style,
}: ProgressBarProps) {
  const ratio =
    value != null && total != null && total > 0
      ? value / total
      : Math.max(0, Math.min(1, progress ?? 0));

  const text =
    label === true && value != null && total != null
      ? `${value}/${total} done`
      : typeof label === 'string'
        ? label
        : null;

  return (
    <View style={style}>
      {text ? (
        <AppText variant="caption" color="textMuted" style={styles.label}>
          {text}
        </AppText>
      ) : null}
      <View style={[styles.track, { height, borderRadius: height }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.round(ratio * 100)}%`, backgroundColor: color, borderRadius: height },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.xs },
  track: { backgroundColor: colors.border, overflow: 'hidden', width: '100%' },
  fill: { height: '100%' },
});

export default ProgressBar;
