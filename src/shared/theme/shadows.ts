import { Platform, ViewStyle } from 'react-native';

/**
 * Elevation / shadow presets — platform-aware.
 *
 * Material 3 uses layered elevation shadows for depth hierarchy.
 * Apple Glass UI uses soft, ambient shadows with low opacity.
 */

type ShadowSet = Record<'level0' | 'level1' | 'level2' | 'level3' | 'float', Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>>;

const m3Shadows = {
  level0: {
    shadowColor:   'transparent',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius:  0,
    elevation:     0,
  },
  level1: {
    shadowColor:   '#1F1A18',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius:  3,
    elevation:     1,
  },
  level2: {
    shadowColor:   '#1F1A18',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius:  6,
    elevation:     3,
  },
  level3: {
    shadowColor:   '#1F1A18',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius:  12,
    elevation:     6,
  },
  float: {
    shadowColor:   '#1F1A18',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation:     8,
  },
} as const satisfies ShadowSet;

const iosShadows: ShadowSet = {
  level0: {
    shadowColor:   'transparent',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius:  0,
    elevation:     0,
  },
  level1: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius:  4,
    elevation:     1,
  },
  level2: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     2,
  },
  level3: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius:  12,
    elevation:     4,
  },
  float: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius:  16,
    elevation:     6,
  },
};

export const shadows = Platform.OS === 'ios' ? iosShadows : m3Shadows;
export type ShadowToken = keyof typeof shadows;
