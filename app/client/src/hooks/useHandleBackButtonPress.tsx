import { useEffect } from "react";

import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

function useHandleBackButtonPress() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;

    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      if (Capacitor.getPlatform() !== "android") return;
      CapacitorApp.removeAllListeners();
    };
  }, []);
}

export default useHandleBackButtonPress;
