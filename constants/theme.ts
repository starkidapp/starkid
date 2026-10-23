/**
 * StarBo design tokens — the single source of truth for colour, spacing,
 * radius, typography and elevation across the app.
 *
 * Direction: "refined playful" — warm, kid-friendly, rounded, star accents,
 * but consistent and modern. Light theme only.
 *
 * Import `palette`, `colors`, `spacing`, `radii`, `typography`, `shadows` and
 * `fontFamily` from here — never hardcode a colour or spacing value in a screen.
 */

import { TextStyle, ViewStyle } from 'react-native';

/* -------------------------------------------------------------------------- */
/*  Raw brand ramps                                                            */
/* -------------------------------------------------------------------------- */

export const palette = {
  // Brand purple
  primary: '#6C63FF',
  primaryDark: '#4F46E5',
  primarySoft: '#EEEDFF',

  // Accent orange
  accent: '#FB8500',
  accentDark: '#E07200',
  accentSoft: '#FFF0DF',

  // Feedback
  star: '#FFC93C',
  starSoft: '#FFF4D6',
  success: '#06D6A0',
  successSoft: '#DFF8F0',
  danger: '#EF476F',
  dangerSoft: '#FDE4EA',
  warning: '#FFB020',
  warningSoft: '#FFF1D9',
  info: '#3AA0FF',
  infoSoft: '#E4F1FF',

  // Neutrals
  ink: '#1F1D2B',
  slate: '#6B7280',
  mist: '#9AA0A6',
  cloud: '#ECE7F5',
  paper: '#FBF7EF',
  paperAlt: '#F3F0FA',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/* -------------------------------------------------------------------------- */
/*  Semantic roles                                                             */
/* -------------------------------------------------------------------------- */

export const colors = {
  /** Default app background — one warm off-white everywhere */
  bg: palette.paper,
  /** Subtle tinted background for grouped sections */
  bgAlt: palette.paperAlt,
  /** Raised surfaces (cards, sheets, inputs-on-card) */
  card: palette.white,

  text: palette.ink,
  textMuted: palette.slate,
  textFaint: palette.mist,
  /** Text/icon colour on top of a `primary` fill */
  onPrimary: palette.white,
  /** Text/icon colour on top of an `accent` fill */
  onAccent: palette.white,

  border: palette.cloud,
  inputBg: '#F6F4FC',
  /** Modal / dialog scrim */
  overlay: 'rgba(20, 16, 40, 0.45)',

  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  success: palette.success,
  danger: palette.danger,
  warning: palette.warning,
  info: palette.info,
  star: palette.star,
} as const;

/* -------------------------------------------------------------------------- */
/*  Spacing — 4pt grid                                                         */
/* -------------------------------------------------------------------------- */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

/** Multiply the 4pt base unit: `space(5)` -> 20 */
export const space = (n: number) => n * 4;

/* -------------------------------------------------------------------------- */
/*  Radii                                                                      */
/* -------------------------------------------------------------------------- */

export const radii = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/* -------------------------------------------------------------------------- */
/*  Typography — Nunito, loaded via @expo-google-fonts/nunito                   */
/* -------------------------------------------------------------------------- */

/**
 * React Native does not synthesise weights for bundled fonts, so each weight
 * is its own family. Map a CSS-style `fontWeight` to the right Nunito face.
 */
export const nunito = {
  '300': 'Nunito_300Light',
  '400': 'Nunito_400Regular',
  '500': 'Nunito_500Medium',
  '600': 'Nunito_600SemiBold',
  '700': 'Nunito_700Bold',
  '800': 'Nunito_800ExtraBold',
} as const;

export function fontFamilyForWeight(
  weight?: TextStyle['fontWeight'] | string | number | null,
): string {
  switch (String(weight ?? '400')) {
    case '100':
    case '200':
    case '300':
      return nunito['300'];
    case '500':
      return nunito['500'];
    case '600':
      return nunito['600'];
    case '700':
    case 'bold':
      return nunito['700'];
    case '800':
    case '900':
      return nunito['800'];
    default:
      return nunito['400'];
  }
}

/** Default body face — used for the global `<Text>` fallback. */
export const fontFamily = nunito['400'];

type TypeToken = Pick<
  TextStyle,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'
>;

/**
 * "Lighter & refined": headings top out at 700, body sits at 400, sizes are
 * restrained with generous line-height.
 */
export const typography = {
  display: { fontSize: 27, lineHeight: 33, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.15 },
  subtitle: { fontSize: 15.5, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  body: { fontSize: 15, lineHeight: 23, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600', letterSpacing: 0 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.4 },
  caption: { fontSize: 12.5, lineHeight: 17, fontWeight: '400', letterSpacing: 0.1 },
} satisfies Record<string, TypeToken>;

export type TypographyVariant = keyof typeof typography;

/* -------------------------------------------------------------------------- */
/*  Elevation                                                                  */
/* -------------------------------------------------------------------------- */

type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export const shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  /** Hard "sticker" shadow — the playful offset block used on hero cards */
  playful: {
    shadowColor: palette.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
} satisfies Record<string, Shadow>;

export type ShadowToken = keyof typeof shadows;
