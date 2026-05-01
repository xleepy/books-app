import { Platform, TextStyle } from 'react-native';

export const fontFamily = {
  regular:   'Inter_400Regular',
  medium:    'Inter_500Medium',
  semibold:  'Inter_600SemiBold',
  bold:      'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

type TypographyPreset = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;

interface TypographyPalette {
  display:      TypographyPreset;
  h1:           TypographyPreset;
  h2:           TypographyPreset;
  h3:           TypographyPreset;
  h4:           TypographyPreset;
  bodyLarge:    TypographyPreset;
  body:         TypographyPreset;
  bodySemibold: TypographyPreset;
  small:        TypographyPreset;
  caption:      TypographyPreset;
  micro:        TypographyPreset;
  tabLabel:     TypographyPreset;
}

/**
 * Material 3 typography — heading weights favour Bold, body uses Medium.
 */
const m3Typography: TypographyPalette = {
  display:      { fontFamily: fontFamily.bold,      fontSize: 28 },
  h1:           { fontFamily: fontFamily.bold,      fontSize: 24 },
  h2:           { fontFamily: fontFamily.bold,      fontSize: 22 },
  h3:           { fontFamily: fontFamily.bold,      fontSize: 20 },
  h4:           { fontFamily: fontFamily.bold,      fontSize: 18 },
  bodyLarge:    { fontFamily: fontFamily.medium,    fontSize: 16 },
  body:         { fontFamily: fontFamily.regular,   fontSize: 14, lineHeight: 21 },
  bodySemibold: { fontFamily: fontFamily.semibold,  fontSize: 14 },
  small:        { fontFamily: fontFamily.regular,   fontSize: 13, lineHeight: 19 },
  caption:      { fontFamily: fontFamily.regular,   fontSize: 12 },
  micro:        { fontFamily: fontFamily.regular,   fontSize: 11 },
  tabLabel:     { fontFamily: fontFamily.semibold,  fontSize: 12 },
};

/**
 * Apple Glass UI typography — headings use Semibold, body uses Regular,
 * with slightly looser iOS type-scale sizes.
 */
const iosTypography: TypographyPalette = {
  display:      { fontFamily: fontFamily.bold,      fontSize: 34 },
  h1:           { fontFamily: fontFamily.bold,      fontSize: 28 },
  h2:           { fontFamily: fontFamily.semibold,  fontSize: 22 },
  h3:           { fontFamily: fontFamily.semibold,  fontSize: 20 },
  h4:           { fontFamily: fontFamily.semibold,  fontSize: 17 },
  bodyLarge:    { fontFamily: fontFamily.regular,   fontSize: 17, lineHeight: 22 },
  body:         { fontFamily: fontFamily.regular,   fontSize: 15, lineHeight: 21 },
  bodySemibold: { fontFamily: fontFamily.semibold,  fontSize: 15 },
  small:        { fontFamily: fontFamily.regular,   fontSize: 13, lineHeight: 19 },
  caption:      { fontFamily: fontFamily.regular,   fontSize: 12 },
  micro:        { fontFamily: fontFamily.regular,   fontSize: 11 },
  tabLabel:     { fontFamily: fontFamily.semibold,  fontSize: 10 },
};

export const typography: TypographyPalette = Platform.OS === 'ios' ? iosTypography : m3Typography;
export type TypographyToken = keyof typeof typography;
