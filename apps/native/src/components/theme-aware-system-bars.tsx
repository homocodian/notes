import { useEffect } from "react";

import {
  setNavbarAppearance,
  SystemBars
} from "@vonovak/react-native-theme-control";

import { useAppTheme } from "@/context/material-3-theme-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function ThemeAwareSystemBars() {
  const theme = useAppTheme();
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    setNavbarAppearance({
      backgroundColor: "transparent",
      barStyle: isDark ? "light-content" : "dark-content"
    });
  }, [theme, isDark]);

  return (
    <SystemBars
      animated
      translucent
      backgroundColor="transparent"
      barStyle={isDark ? "light-content" : "dark-content"}
    />
  );
}
