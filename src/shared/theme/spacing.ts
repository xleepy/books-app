import { Platform } from 'react-native';

/**
 * Spacing scale — shared across platforms.
 * Follows a 4 px grid for consistent rhythm.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Shared shape for radii tokens. */
interface RadiiPalette {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

/**
 * Material 3 uses a sharper, structured radius system (4–20).
 */
const m3Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 20,
} as const satisfies RadiiPalette;

/**
 * Apple Glass UI uses rounder, softer corners (6–28).
 */
const iosRadii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 28,
} as const satisfies RadiiPalette;

export const radii: RadiiPalette = Platform.OS === 'ios' ? iosRadii : m3Radii;
export type RadiiToken = keyof typeof radii;
