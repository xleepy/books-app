import { ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from '@shared/theme';

export function NavigationProvider({ children }: { children: ReactNode }) {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.accent,
          background: colors.bgPrimary,
          card: colors.bgCard,
          text: colors.fontPrimary,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      {children}
    </NavigationContainer>
  );
}
