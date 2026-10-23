import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Show a show/hide toggle; forces `secureTextEntry` when hidden. */
  secureToggle?: boolean;
  containerStyle?: ViewStyle;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    error,
    helper,
    leftIcon,
    secureToggle = false,
    containerStyle,
    style,
    onFocus,
    onBlur,
    editable = true,
    autoFocus = false,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const innerRef = useRef<TextInput | null>(null);
  const setRefs = (node: TextInput | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<TextInput | null>).current = node;
  };

  // Native `autoFocus` is unreliable inside <Modal> (the field isn't mounted
  // when it fires). Focus explicitly once the field is on screen.
  useEffect(() => {
    if (!autoFocus || !editable) return;
    const t = setTimeout(() => innerRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [autoFocus, editable]);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="label" color="textMuted" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.field,
          { borderColor, backgroundColor: editable ? colors.inputBg : colors.bgAlt },
          !editable && styles.disabled,
        ]}
      >
        {leftIcon ? (
          <Ionicons name={leftIcon} size={18} color={colors.textFaint} style={styles.leftIcon} />
        ) : null}

        <TextInput
          ref={setRefs}
          editable={editable}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={secureToggle ? hidden : rest.secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
          {...rest}
        />

        {secureToggle ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} style={styles.toggle}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.textFaint}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" color="danger" style={styles.hint}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" color="textFaint" style={styles.hint}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  disabled: { opacity: 0.6 },
  leftIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  toggle: { paddingLeft: spacing.sm },
  hint: { marginTop: spacing.xs },
});

export default TextField;
