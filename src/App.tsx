import { Capacitor } from "@capacitor/core";
import loadable, { LoadableComponent } from "@loadable/component";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";

import { RouteComponents } from "@/Routes";
import AppBar from "@/components/AppBar";
import ThemedToaster from "@/components/ThemedToaster";
import Connectivity from "@/components/general/Connectivity";
import AccountMenuProvider from "@/context/AccountMenuContext";
import DrawerProvider from "@/context/DrawerContext";
import useHandleBackButtonPress from "@/hooks/useHandleBackButtonPress";
import { useTheme } from "@/hooks/useTheme";

let CheckForUpdates: LoadableComponent<unknown>;

if (Capacitor.isNativePlatform()) {
  CheckForUpdates = loadable(
    () => import("@/components/general/CheckForUpdates"),
  );
}

function App() {
  const { theme } = useTheme();
  useHandleBackButtonPress();

  return (
    <ThemeProvider theme={theme}>
      <DrawerProvider>
        <AccountMenuProvider>
          <AppBar />
          <div style={{ paddingTop: "64px", overflow: "auto" }}>
            <Routes>
              {RouteComponents.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </div>
          <Connectivity />
          {CheckForUpdates ? <CheckForUpdates /> : null}
          <ThemedToaster />
        </AccountMenuProvider>
      </DrawerProvider>
    </ThemeProvider>
  );
}

export default App;
