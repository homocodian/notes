import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

import { getDesignTokens } from "@/utils/get-design-token";

export function useTheme() {
  // get theme value from local storage
  const { isDarkMode } = useTernaryDarkMode();

  const theme = useMemo(() => {
    if (isDarkMode) document.body.style.backgroundColor = "#18181b";
    else document.body.style.backgroundColor = "#fff";
    return createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
  }, [isDarkMode]);

  return { theme };
}
