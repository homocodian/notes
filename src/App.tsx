import {
  AccountMenuProvider,
  DrawerProvider,
  TodosProvider,
  TodoTypeProvider,
} from "./context";
import useUpdate from "./utils/useUpdate";
import { PaletteMode } from "@mui/material";
import { TodosBoard } from "./components/main";
import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "./components/auth";
import { useEffect, useMemo, useState } from "react";
import { PrivateRoute, MenuAppBar } from "./components";
import { getDesignTokens } from "./utils/getDesignToken";
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
      <DrawerProvider>
        <AccountMenuProvider>
          <MenuAppBar appThemeMode={theme.palette.mode} setMode={setMode} />
          <Routes>
            <Route path="/">
              <Route
                index
                element={
                  <PrivateRoute>
                    <TodoTypeProvider>
                      <TodosProvider>
                        <TodosBoard />
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
    </ThemeProvider>
  );
}

export default App;
