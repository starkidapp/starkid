import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  /** Leading emoji (e.g. "🏆") rendered before the title. */
  emoji?: string;
  subtitle?: string;
  /** Optional trailing element — a link, count, or button. */
  action?: ReactNode;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  emoji,
  subtitle,
  action,
  onActionPress,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <View style={styles.titleRow}>
          {emoji ? <AppText style={styles.emoji}>{emoji}</AppText> : null}
          <AppText variant="heading">{title}</AppText>
        </View>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {action ? (
        onActionPress ? (
          <Pressable onPress={onActionPress} hitSlop={8}>
            {action}
          </Pressable>
        ) : (
          action
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  left: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 20, marginRight: spacing.sm },
  subtitle: { marginTop: 2 },
});

export default SectionHeader;
