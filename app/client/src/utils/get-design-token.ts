import { PaletteMode } from "@mui/material";
import { deepOrange, grey, lightBlue } from "@mui/material/colors";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: deepOrange,
          divider: deepOrange[700],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: lightBlue,
          divider: lightBlue[700],
          background: {
            default: "#121212",
            paper: "#121212",
          },
          text: {
            primary: "#fff",
            secondary: grey[500],
          },
        }),
  },
  typography: {
    fontFamily: "system-ui",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});
