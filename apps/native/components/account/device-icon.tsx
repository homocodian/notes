import { AntDesign, Feather, FontAwesome6, Octicons } from "@expo/vector-icons";

import { useAppTheme } from "@/context/material-3-theme-provider";
import { DeviceType } from "@/lib/device";

export function DeviceIcon({
  deviceType,
  name,
  os
}: {
  deviceType: DeviceType;
  os: string;
  name?: string | null;
}) {
  const theme = useAppTheme();

  if (deviceType === "UNKNOWN" && name) {
    switch (name) {
      case "Chrome":
        return (
          <FontAwesome6
            name="chrome"
            size={20}
            color={theme.colors.onBackground}
          />
        );
      case "Safari":
        return (
          <FontAwesome6
            name="safari"
            size={20}
            color={theme.colors.onBackground}
          />
        );

      case "Edge":
        return (
          <FontAwesome6
            name="edge"
            size={20}
            color={theme.colors.onBackground}
          />
        );

      default:
        break;
    }
  }

  if (deviceType === "UNKNOWN" && os) {
    switch (os) {
      case "Windows":
        return (
          <FontAwesome6
            name="windows"
            size={20}
            color={theme.colors.onBackground}
          />
        );

      case "Linux":
        return (
          <FontAwesome6
            name="linux"
            size={20}
            color={theme.colors.onBackground}
          />
        );

      default:
        break;
    }

    if (os.includes("Mac") || os.includes("iOS")) {
      return (
        <FontAwesome6
          name="apple"
          size={20}
          color={theme.colors.onBackground}
        />
      );
    }
  }

  switch (deviceType) {
    case "PHONE":
      return (
        <AntDesign name="mobile1" size={20} color={theme.colors.onBackground} />
      );
    case "TABLET":
      return (
        <Feather name="tablet" size={20} color={theme.colors.onBackground} />
      );
    case "DESKTOP":
      return (
        <Octicons
          name="device-desktop"
          size={20}
          color={theme.colors.onBackground}
        />
      );
    case "TV":
      return (
        <FontAwesome6 name="tv" size={20} color={theme.colors.onBackground} />
      );

    default:
      return (
        <FontAwesome6
          name="exclamation"
          size={20}
          color={theme.colors.onBackground}
        />
      );
  }
}
