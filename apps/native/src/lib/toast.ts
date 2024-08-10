import { Platform, ToastAndroid } from "react-native";

import { Snackbar } from "@/components/ui/use-snackbar";

type options = {
  android: {
    duration: "SHORT" | "LONG";
  };
};

export function toast(message: string, options?: options) {
  if (Platform.OS === "android") {
    ToastAndroid.show(
      message,
      ToastAndroid[options?.android.duration ?? "SHORT"]
    );
  } else {
    Snackbar({ text: message });
  }
}
