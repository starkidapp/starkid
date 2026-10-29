import { ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { colors, radii, shadows, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Button, ButtonVariant } from './Button';
import { ModalBackdrop } from './ModalBackdrop';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  /** Buttons rendered in a row at the bottom. */
  actions?: DialogAction[];
  /** Tap outside / hardware back closes the dialog (default true). */
  dismissable?: boolean;
  /**
   * Render as an absolute overlay inside the current screen instead of a native
   * <Modal>. Use for dialogs that open as soon as a screen mounts: presenting a
   * Modal while the screen is still animating in can freeze the app on iOS.
   */
  inline?: boolean;
}

export function Dialog({
  visible,
  onClose,
  title,
  subtitle,
  children,
  actions,
  dismissable = true,
  inline = false,
}: DialogProps) {
  const content = (
    <ModalBackdrop
      style={inline && styles.inlineOverlay}
      onPressBackdrop={dismissable ? onClose : undefined}
    >
      <View style={styles.card}>
        {title ? <AppText variant="heading">{title}</AppText> : null}
        {subtitle ? (
          <AppText variant="body" color="textMuted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}

        {children ? (
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : null}

        {actions && actions.length > 0 ? (
          <View style={styles.actions}>
            {actions.map((a) => (
              <Button
                key={a.label}
                title={a.label}
                variant={a.variant ?? 'primary'}
                loading={a.loading}
                disabled={a.disabled}
                onPress={a.onPress}
                style={styles.actionBtn}
              />
            ))}
          </View>
        ) : null}
      </View>
    </ModalBackdrop>
  );

  if (inline) {
    return visible ? content : null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissable ? onClose : undefined}
      statusBarTranslucent
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  inlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
  },
  card: {
    marginHorizontal: spacing['2xl'],
    marginVertical: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
    ...shadows.lg,
  },
  subtitle: { marginTop: spacing.sm },
  body: { marginTop: spacing.lg, maxHeight: 360 },
  bodyContent: { gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  actionBtn: { flex: 1 },
});

export default Dialog;
