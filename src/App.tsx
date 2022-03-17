import { useMemo } from "react";
import Seperator from "./components/Seperator";
import { useTernaryDarkMode } from "usehooks-ts";
import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "./components/auth";
import { NotesContainer } from "./components/main";
import { PrivateRoute, MenuAppBar } from "./components";
import { getDesignTokens } from "./utils/getDesignToken";
import { AccountMenuProvider, DrawerProvider } from "./context";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NotesCategoryProvider from "./context/NotesCategoryProvider";

function App() {
  // get theme value from localstorage
  const { isDarkMode } = useTernaryDarkMode();

  // returns theme object for mui
  const theme = useMemo(() => {
    if (isDarkMode) document.body.style.backgroundColor = "#18181b";
    else document.body.style.backgroundColor = "#fff";
    return createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
  }, [isDarkMode]);

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
                        <NotesContainer />
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
