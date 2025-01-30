import { useColorScheme as NativeColorScheme } from "react-native";

import { useThemePreference } from "@vonovak/react-native-theme-control";

export function useColorScheme(): "light" | "dark" {
  const nativeColorScheme = NativeColorScheme() ?? "light";
  const themePreference = useThemePreference();

  return themePreference === "system" ? nativeColorScheme : themePreference;
}
