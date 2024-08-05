import { Platform } from "react-native";

import * as Sentry from "@sentry/react-native";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

export const DEVICE_TYPE = [
  "UNKNOWN",
  "PHONE",
  "TABLET",
  "DESKTOP",
  "TV"
] as const;

export type DeviceType = (typeof DEVICE_TYPE)[number];

export type TDevice = {
  type: DeviceType;
  name: string;
  model: string;
  osVersion: string;
  os: string;
};

function getDeviceType(type: Device.DeviceType | null): DeviceType | undefined {
  if (!type) return undefined;
  switch (type) {
    case Device.DeviceType.PHONE:
      return "PHONE";
    case Device.DeviceType.TABLET:
      return "TABLET";
    case Device.DeviceType.DESKTOP:
      return "DESKTOP";
    case Device.DeviceType.TV:
      return "TV";
    default:
      return "UNKNOWN";
  }
}

export function getDeviceInfo() {
  const device: Partial<TDevice> = {
    type: getDeviceType(Device.deviceType),
    name: Device.deviceName ?? undefined,
    model: Device.modelName ?? undefined,
    osVersion: Device.osVersion ?? undefined,
    os: Device.osName ?? undefined
  };
  return device;
}

export async function getDeviceId() {
  const newUniqueId =
    Platform.OS === "android"
      ? Application.getAndroidId() ?? Crypto.randomUUID()
      : (await Application.getIosIdForVendorAsync()) ?? Crypto.randomUUID();

  let uniqueId = null;

  try {
    uniqueId = await SecureStore.getItemAsync("uniqueDeviceId");
  } catch (error) {
    Sentry.captureException(error);
  }

  try {
    if (!uniqueId) {
      uniqueId = newUniqueId;
      await SecureStore.setItemAsync("uniqueDeviceId", uniqueId);
    }
  } catch (error) {
    uniqueId = newUniqueId;
    Sentry.captureException(error);
  }

  return uniqueId;
}
