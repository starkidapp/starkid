import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

export interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Apply the standard horizontal gutter (and vertical padding) to content. */
  padded?: boolean;
  /** Vertically centre content — handy for auth screens. Implies non-scroll unless `scroll`. */
  center?: boolean;
  /** Background colour token override. Defaults to `colors.bg`. */
  background?: string;
  /** Apply the top safe-area inset. Set false when a ScreenHeader above already handles it. */
  topInset?: boolean;
  edges?: readonly Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  /** Extra props forwarded to the inner ScrollView when `scroll`. */
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'style'>;
}

/**
 * Standard screen shell: safe-area, app background, optional scroll +
 * keyboard avoidance + padding. Every screen root should use this.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  center = false,
  background = colors.bg,
  topInset = true,
  edges,
  style,
  contentContainerStyle,
  scrollProps,
}: ScreenProps) {
  const resolvedEdges: readonly Edge[] =
    edges ?? (topInset ? ['top', 'left', 'right'] : ['left', 'right']);
  const contentPadding: ViewStyle | null = padded
    ? { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg }
    : null;

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}
      style={styles.flex}
      contentContainerStyle={[
        contentPadding,
        center && styles.centerContent,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        contentPadding,
        center && styles.centerContent,
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }, style]} edges={resolvedEdges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centerContent: { flexGrow: 1, justifyContent: 'center' },
});

export default Screen;
