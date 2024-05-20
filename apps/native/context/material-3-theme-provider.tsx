import React from "react";
import { useColorScheme } from "react-native";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme
} from "react-native-paper";

import {
  Material3Scheme,
  Material3Theme,
  useMaterial3Theme
} from "@pchmn/expo-material3-theme";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import merge from "deepmerge";

type Material3ThemeProviderProps = {
  theme: Material3Theme;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const Material3ThemeProviderContext =
  React.createContext<Material3ThemeProviderProps>(
    {} as Material3ThemeProviderProps
  );

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme
});

export function Material3ThemeProvider({
  children,
  sourceColor,
  fallbackSourceColor,
  ...otherProps
}: ProviderProps & { sourceColor?: string; fallbackSourceColor?: string }) {
  const colorScheme = useColorScheme();

  // Material theme adaptive
  const { theme, updateTheme, resetTheme } = useMaterial3Theme({
    sourceColor,
    fallbackSourceColor
  });

  const { paperTheme, navigationTheme } = React.useMemo(() => {
    if (colorScheme === "dark") {
      const paperTheme = { ...MD3DarkTheme, colors: theme.dark };
      return {
        paperTheme,
        navigationTheme: merge(DarkTheme, paperTheme)
      };
    }

    const paperTheme = { ...MD3LightTheme, colors: theme.light };
    return { paperTheme, navigationTheme: merge(LightTheme, paperTheme) };
  }, [colorScheme, theme.dark, theme.light]);

  return (
    <Material3ThemeProviderContext.Provider
      value={{ theme, updateTheme, resetTheme }}
    >
      <PaperProvider theme={paperTheme} {...otherProps}>
        <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
      </PaperProvider>
    </Material3ThemeProviderContext.Provider>
  );
}

export function useMaterial3ThemeContext() {
  const ctx = React.useContext(Material3ThemeProviderContext);
  if (!ctx) {
    throw new Error(
      "useMaterial3ThemeContext must be used inside Material3ThemeProvider"
    );
  }
  return ctx;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;
