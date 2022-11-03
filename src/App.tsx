import { useMemo } from "react";

import { Routes, Route } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Seperator from "./components/Seperator";
import { PrivateRoute, MenuAppBar } from "./components";
import { getDesignTokens } from "./utils/getDesignToken";
import { AccountMenuProvider, DrawerProvider } from "./context";
import NotesCategoryProvider from "./context/NotesCategoryProvider";

async function changeStatusbarColor(isDarkMode: boolean) {
  if (Capacitor.getPlatform() === "android") {
    if (isDarkMode) {
      await StatusBar.setBackgroundColor({ color: "#121212" });
    } else {
      await StatusBar.setBackgroundColor({ color: "#ff5722" });
    }
    await StatusBar.setStyle({ style: Style.Dark });
  }
}

function App() {
  // get theme value from localstorage
  const { isDarkMode } = useTernaryDarkMode();

  // returns theme object for mui
  const theme = useMemo(() => {
    if (isDarkMode) document.body.style.backgroundColor = "#18181b";
    else document.body.style.backgroundColor = "#fff";
    return createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
  }, [isDarkMode]);

  changeStatusbarColor(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <AccountMenuProvider>
          <MenuAppBar />
          <Seperator>
            <Routes>
              <Route path="/">
                <Route
                  index
                  element={
                    <PrivateRoute>
                      <NotesCategoryProvider>
                        <Home />
                      </NotesCategoryProvider>
                    </PrivateRoute>
                  }
                />
                <Route path="signup" element={<SignUp />} />
                <Route path="login" element={<SignIn />} />
              </Route>
            </Routes>
          </Seperator>
        </AccountMenuProvider>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export default App;
