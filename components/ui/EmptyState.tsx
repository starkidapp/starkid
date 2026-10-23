import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface EmptyStateProps {
  emoji?: string;
  title: string;
  message?: string;
  /** Optional call-to-action, typically a <Button />. */
  action?: ReactNode;
  style?: ViewStyle;
}

export function EmptyState({ emoji = '✨', title, message, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.emoji}>{emoji}</AppText>
      <AppText variant="subtitle" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color="textMuted" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] },
  emoji: { fontSize: 44, marginBottom: spacing.md },
  message: { marginTop: spacing.xs, maxWidth: 300 },
  action: { marginTop: spacing.xl },
});

export default EmptyState;
