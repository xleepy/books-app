import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.fontPrimary,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: colors.fontPrimary,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.fontPrimary,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontPrimary,
  },
  h4: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  bodyLarge: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.fontPrimary,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontPrimary,
    lineHeight: 21,
  },
  bodySemibold: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.fontPrimary,
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.fontSecondary,
    lineHeight: 19,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.fontSecondary,
  },
  micro: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontTertiary,
  },
  tabLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
} satisfies Record<string, TextStyle>;
