import { useState } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useAppTheme } from "@/context/material-3-theme-provider";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { Device } from "@/lib/device";
import { toast } from "@/lib/toast";

import { DeviceIcon } from "./device-icon";

dayjs.extend(relativeTime);

interface DeviceRevokeButtonProps {
  device: Device;
  dismissable?: boolean;
  refresh?: () => void;
}

export function DeviceRevokeButton({
  dismissable = true,
  device,
  refresh
}: DeviceRevokeButtonProps) {
  const theme = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);

  async function revoke() {
    setIsLoading(true);
    try {
      await API.delete(`/v1/user/devices/${device.id}`);
      refresh?.();
    } catch (error) {
      toast(
        error instanceof APIError
          ? error.message
          : "Failed to log out all devices"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex flex-row justify-between items-center py-2 px-2">
      <View className="flex flex-row space-x-2">
        <View className="flex justify-center items-center">
          <View
            style={{
              backgroundColor: theme.colors.background,
              height: 36,
              width: 36
            }}
            className="rounded-full flex justify-center items-center"
          >
            <DeviceIcon
              deviceType={device.type}
              os={device.os}
              name={device.name}
            />
          </View>
        </View>
        <View>
          <Text variant="labelLarge">
            {device.os ?? "Unknown"}
            {" • "}
            {device.name ?? "Unkown"}
          </Text>
          <Text variant="bodySmall">
            {device.city ?? "Unknown"}, {device.state ?? "Unknown"},{" "}
            {device.country ?? "Unknown"}
          </Text>
          <Text variant="bodySmall">{dayjs().to(dayjs(device.createdAt))}</Text>
        </View>
      </View>
      {dismissable ? (
        <IconButton icon="close" onPress={revoke} loading={isLoading} />
      ) : null}
    </View>
  );
}
