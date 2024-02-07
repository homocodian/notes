import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { Route, Routes } from "react-router-dom";

import { RouteComponents } from "@/Routes";
import AppBar from "@/components/AppBar";
import ThemedToaster from "@/components/ThemedToaster";
import Connectivity from "@/components/general/Connectivity";
import DrawerProvider from "@/context/DrawerContext";
import useHandleBackButtonPress from "@/hooks/useHandleBackButtonPress";
import { useTheme } from "@/hooks/useTheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "./components/auth";
import { queryClient } from "./utils/query-client";

const ReactQueryDevtools = React.lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  })),
);

function App() {
  const { theme } = useTheme();
  useHandleBackButtonPress();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Auth>
          <DrawerProvider>
            <AppBar />
            <div className="overflow-auto h-full pt-4 pb-10 md:pb-16">
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
            <ThemedToaster />
          </DrawerProvider>
        </Auth>
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
