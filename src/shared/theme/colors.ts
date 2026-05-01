import { Platform } from 'react-native';

/** Shared shape — every palette must define these exact tokens. */
interface ColorPalette {
  accent: string;
  accentLight: string;
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
 * Material Design 3 palette — Android
 * Surface-based tonal palette derived from brand seed #C45A3C (terracotta).
 * https://m3.material.io/styles/color/roles
 */
const m3 = {
  accent:            '#AB3F2A',
  accentLight:       '#FFDAD2',
  accentGreen:       '#2D6B43',
  accentRed:         '#BA1A1A',
  bgPrimary:         '#FFFBFF',
  bgSecondary:       '#F1ECEA',
  bgCard:            '#F7F2F0',
  bgDark:            '#1C1B1F',
  fontPrimary:       '#1F1A18',
  fontSecondary:     '#53443F',
  fontTertiary:      '#857470',
  fontInverse:       '#FFFFFF',
  border:            '#CBC0BA',
  borderLight:       '#E8DFD9',
  starGold:          '#986F00',
  tabInactive:       '#857470',
  badgeGold:         '#8D6100',
  badgeGoldLight:    '#FFE9B7',
  challengeBlue:     '#416B9E',
  challengeBlueLight:'#DCE6F4',
  streakOrange:      '#C85C2A',
  streakOrangeLight: '#FFEDE2',
  xpPurple:          '#735DB0',
  xpPurpleLight:     '#EAE3F6',
  surfaceHigh:       '#ECE6E2',
  pillActive:        '#FFDAD2',
  pillBorder:        '#CBC0BA66',
  pillShadow:        '#1F1A1814',
} as const satisfies ColorPalette;

/**
 * Apple Glass UI palette — iOS
 * Frosted-glass aesthetic with iOS system colors.
 * Cards use semi-transparent fills for the glass effect.
 */
const ios = {
  accent:            '#FF6B35',
  accentLight:       '#FFEAE0',
  accentGreen:       '#34C759',
  accentRed:         '#FF3B30',
  bgPrimary:         '#F2F2F7',
  bgSecondary:       '#E5E5EACC',
  bgCard:            '#FFFFFFF0',
  bgDark:            '#1C1C1E',
  fontPrimary:       '#000000',
  fontSecondary:     '#3C3C4399',
  fontTertiary:      '#3C3C434D',
  fontInverse:       '#FFFFFF',
  border:            '#C6C6C8',
  borderLight:       '#E5E5EA',
  starGold:          '#FFCC00',
  tabInactive:       '#8E8E93',
  badgeGold:         '#FFCC00',
  badgeGoldLight:    '#FFF8E0',
  challengeBlue:     '#007AFF',
  challengeBlueLight:'#E5F1FF',
  streakOrange:      '#FF9500',
  streakOrangeLight: '#FFF0E0',
  xpPurple:          '#AF52DE',
  xpPurpleLight:     '#F2E6FA',
  surfaceHigh:       '#FFFFFFE6',
  pillActive:        '#FF6B3526',
  pillBorder:        '#FFFFFF66',
  pillShadow:        '#00000014',
} as const satisfies ColorPalette;

export const colors: ColorPalette = Platform.OS === 'ios' ? ios : m3;
export type ColorToken = keyof typeof colors;
