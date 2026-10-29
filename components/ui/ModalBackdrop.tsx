import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '@/constants/theme';

export interface ModalBackdropProps {
  children: ReactNode;
  /** Called when the dimmed area around the popup is tapped. */
  onPressBackdrop?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Dimmed full-screen backdrop that centres a popup and lifts it above the
 * keyboard, scrolling when the popup is taller than the space left.
 * 'padding' is used on Android too: edge-to-edge windows don't resize for the
 * keyboard (and Modals never do), and the padding is measured against the
 * actual overlap, so it is 0 whenever the window already resized.
 */
export function ModalBackdrop({ children, onPressBackdrop, style }: ModalBackdropProps) {
  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.backdrop, style]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.center} onPress={onPressBackdrop} disabled={!onPressBackdrop}>
          {/* Swallow taps on the popup itself so they don't reach the backdrop. */}
          <Pressable onPress={() => {}}>{children}</Pressable>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  scrollContent: { flexGrow: 1 },
  center: { flexGrow: 1, justifyContent: 'center' },
});

export default ModalBackdrop;
