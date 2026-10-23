import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { fontFamilyForWeight } from '@/constants/theme';

/**
 * Drop-in replacement for React Native's `<Text>` that renders in the correct
 * Nunito face for whatever `fontWeight` its style resolves to. Use this in
 * screens that still lean on ad-hoc `StyleSheet` text styles; prefer `AppText`
 * (variant-based) for new code.
 */
export function Text({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) as { fontWeight?: string; fontFamily?: string } | undefined;
  const fontFamily = flat?.fontFamily ?? fontFamilyForWeight(flat?.fontWeight);
  return <RNText {...rest} style={[{ fontFamily }, style]} />;
}

export default Text;
