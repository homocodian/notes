import { useEffect } from "react";

import analytics from "@react-native-firebase/analytics";
import * as Sentry from "@sentry/react-native";
import { usePathname } from "expo-router";

export function useLogScreenView() {
  const pathname = usePathname();

  useEffect(() => {
    const logScreenView = async () => {
      try {
        await analytics().logScreenView({
          screen_name: pathname,
          screen_class: pathname
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };
    if (!__DEV__) {
      logScreenView();
    }
  }, [pathname]);
}
