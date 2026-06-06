import { Platform } from 'react-native';

/** Shared shape — every palette must define these exact tokens. */
interface ColorPalette {
  accent: string;
  accentLight: string;
  accent1A: string;
  accent33: string;
  accent80: string;
  accentCC: string;
  accentGreen: string;
  accentRed: string;
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgDark: string;
  fontPrimary: string;
  fontSecondary: string;
  fontTertiary: string;
  fontInverse: string;
  border: string;
  borderLight: string;
  starGold: string;
  tabInactive: string;
  badgeGold: string;
  badgeGoldLight: string;
  challengeBlue: string;
  challengeBlueLight: string;
  streakOrange: string;
  streakOrangeLight: string;
  xpPurple: string;
  xpPurpleLight: string;
  surfaceHigh: string;
  pillActive: string;
  pillBorder: string;
  pillShadow: string;
}

/**
 * Material Design 3 palette — Android.
 * Brand seed: #2F6F5E (deep moss green). Cream/parchment surfaces.
 * https://m3.material.io/styles/color/roles
 */
const m3 = {
  accent:            '#2F6F5E',
  accentLight:       '#DDEDE7',
  accent1A:          '#2F6F5E1A',
  accent33:          '#2F6F5E33',
  accent80:          '#2F6F5E80',
  accentCC:          '#2F6F5ECC',
  accentGreen:       '#2D6B43',
  accentRed:         '#BA1A1A',
  bgPrimary:         '#FBFAF6',
  bgSecondary:       '#E8E3D8',
  bgCard:            '#F1EFE8',
  bgDark:            '#1C1B1F',
  fontPrimary:       '#1D211E',
  fontSecondary:     '#4C5A53',
  fontTertiary:      '#7A837E',
  fontInverse:       '#FFFFFF',
  border:            '#C9C5BA',
  borderLight:       '#E3DED2',
  starGold:          '#9C762F',
  tabInactive:       '#7A837E',
  badgeGold:         '#9C762F',
  badgeGoldLight:    '#F1E7D2',
  challengeBlue:     '#3E6B7A',
  challengeBlueLight:'#DDE9EA',
  streakOrange:      '#9C762F',
  streakOrangeLight: '#F1E7D2',
  xpPurple:          '#735DB0',
  xpPurpleLight:     '#EAE3F6',
  surfaceHigh:       '#ECE6E2',
  pillActive:        '#DDEDE7',
  pillBorder:        '#C9C5BA66',
  pillShadow:        '#1D211E14',
} as const satisfies ColorPalette;

/**
 * Apple Glass UI palette — iOS.
 * Frosted-glass aesthetic on cream surfaces. Uses the same brand accent
 * as Material 3 (deep moss green #2F6F5E) to keep cross-platform parity.
 */
const ios = {
  accent:            '#2F6F5E',
  accentLight:       '#DDEDE7',
  accent1A:          '#2F6F5E1A',
  accent33:          '#2F6F5E33',
  accent80:          '#2F6F5E80',
  accentCC:          '#2F6F5ECC',
  accentGreen:       '#34C759',
  accentRed:         '#BA1A1A',
  bgPrimary:         '#FBFAF6',
  bgSecondary:       '#FFFFFFF0',
  bgCard:            '#FFFFFFF0',
  bgDark:            '#1C1C1E',
  fontPrimary:       '#1D211E',
  fontSecondary:     '#4C5A53',
  fontTertiary:      '#7A837E',
  fontInverse:       '#FFFFFF',
  border:            '#FFFFFF66',
  borderLight:       '#E3DED2',
  starGold:          '#9C762F',
  tabInactive:       '#8E8E93',
  badgeGold:         '#9C762F',
  badgeGoldLight:    '#F1E7D2',
  challengeBlue:     '#3E6B7A',
  challengeBlueLight:'#DDE9EA',
  streakOrange:      '#9C762F',
  streakOrangeLight: '#F1E7D2',
  xpPurple:          '#735DB0',
  xpPurpleLight:     '#EAE3F6',
  surfaceHigh:       '#FFFFFFE6',
  pillActive:        '#2F6F5E26',
  pillBorder:        '#FFFFFF66',
  pillShadow:        '#00000012',
} as const satisfies ColorPalette;

export const colors: ColorPalette = Platform.OS === 'ios' ? ios : m3;
export type ColorToken = keyof typeof colors;
