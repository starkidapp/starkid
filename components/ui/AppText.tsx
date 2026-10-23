import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fontFamilyForWeight, typography, TypographyVariant } from '@/constants/theme';

type ColorToken = keyof typeof colors | (string & {});

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  /** A semantic colour token (`text`, `textMuted`, `primary`, …) or a raw colour string. */
  color?: ColorToken;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
}

function resolveColor(token: ColorToken): string {
  if (token in colors) return colors[token as keyof typeof colors];
  return token as string;
}

/**
 * The single text primitive. Replaces bare `<Text>` and standardises the
 * type scale. Defaults to `body` / `text`. Picks the correct Nunito face for
 * the resolved weight.
 */
export function AppText({
  variant = 'body',
  color = 'text',
  align,
  weight,
  style,
  ...rest
}: AppTextProps) {
  const token = typography[variant];
  const finalWeight = weight ?? (token.fontWeight as TextStyle['fontWeight']);

  return (
    <Text
      {...rest}
      style={[
        token,
        { fontFamily: fontFamilyForWeight(finalWeight), color: resolveColor(color) },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
    />
  );
}

export default AppText;
