import useUpdate from "./utils/useUpdate";
import { PaletteMode } from "@mui/material";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import MenuAppBar from "./components/MenuAppBar";
import TodosProvider from "./context/TodoContext";
import TodoBoard from "./components/main/TodosBoard";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useMemo, useState } from "react";
import DrawerProvider from "./context/DrawerContext";
import { getDesignTokens } from "./utils/getDesignToken";
import TodoTypeProvider from "./context/TodoTypeContext";
import AccountMenuProvider from "./context/AccountMenuContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const appTheme = localStorage.getItem("appTheme");
    if (appTheme === "dark") {
      setMode("dark");
    }
  }, []);

  const theme = useMemo(() => {
    if (mode === "dark") {
      document.body.style.backgroundColor = "#121212";
    } else {
      document.body.style.backgroundColor = "#fff";
    }
    return createTheme(getDesignTokens(mode));
  }, [mode]);

  useUpdate(() => {
    localStorage.setItem("appTheme", mode.toString());
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DrawerProvider>
          <AccountMenuProvider>
            <MenuAppBar appThemeMode={theme.palette.mode} setMode={setMode} />
            <Routes>
              <Route path="/">
                <Route
                  index
                  element={
                    // @ts-expect-error
                    <PrivateRoute>
                      <TodoTypeProvider>
                        <TodosProvider>
                          <TodoBoard />
                        </TodosProvider>
                      </TodoTypeProvider>
                    </PrivateRoute>
                  }
                />
                <Route path="signup" element={<SignUp />} />
                <Route path="login" element={<SignIn />} />
              </Route>
            </Routes>
          </AccountMenuProvider>
        </DrawerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
