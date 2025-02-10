import { Platform } from "react-native";

import * as Sentry from "@sentry/react-native";
import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import * as ExpoDevice from "expo-device";
import * as SecureStore from "expo-secure-store";

export type Device = {
  id: number;
  ip: string | null;
  userId: number;
  type: DeviceType;
  os: string;
  name: string | null;
  model: string | null;
  osVersion: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  timezone: string | null;
  createdAt: string;
};

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

function getDeviceType(
  type: ExpoDevice.DeviceType | null
): DeviceType | undefined {
  if (!type) return undefined;
  switch (type) {
    case ExpoDevice.DeviceType.PHONE:
      return "PHONE";
    case ExpoDevice.DeviceType.TABLET:
      return "TABLET";
    case ExpoDevice.DeviceType.DESKTOP:
      return "DESKTOP";
    case ExpoDevice.DeviceType.TV:
      return "TV";
    default:
      return "UNKNOWN";
  }
}

export function getDeviceInfo() {
  const device: Partial<TDevice> = {
    type: getDeviceType(ExpoDevice.deviceType),
    name: ExpoDevice.deviceName ?? undefined,
    model: ExpoDevice.modelName ?? undefined,
    osVersion: ExpoDevice.osVersion ?? undefined,
    os: ExpoDevice.osName ?? undefined
  };
  return device;
}

export async function getDeviceId() {
  const newUniqueId =
    Platform.OS === "android"
      ? (Application.getAndroidId() ?? Crypto.randomUUID())
      : ((await Application.getIosIdForVendorAsync()) ?? Crypto.randomUUID());

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
