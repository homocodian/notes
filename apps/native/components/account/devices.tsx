import { Fragment, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Divider,
  Portal,
  Surface,
  Text,
  TouchableRipple
} from "react-native-paper";

import { useQuery } from "@tanstack/react-query";

import { Colors } from "@/constant/colors";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { Device } from "@/lib/device";
import { toast } from "@/lib/toast";

import { DeviceRevokeButton } from "./device-rovoke-button";
import { Section } from "./section";

type QueryData = { current?: Device; others: Device[] };

export function Devices() {
  const theme = useAppTheme();
  const { signOut } = useAuth();
  const { data, isLoading, refetch } = useQuery<QueryData>({
    initialData: { current: undefined, others: [] },
    queryKey: ["devices"],
    queryFn: () => {
      return API.get("/v1/user/devices");
    }
  });

  const [isLogginOut, setIsLogginOut] = useState(false);

  async function logoutAllDevices() {
    setIsLogginOut(true);
    try {
      await API.post("/v1/auth/logout-all", { data: {} });
      signOut();
    } catch (error) {
      toast(
        error instanceof APIError
          ? error.message
          : "Failed to log out all devices"
      );
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 flex justify-center items-center">
        <ActivityIndicator animating />
      </View>
    );
  }

  return (
    <>
      <ScrollView className="space-y-4">
        <View className="mb-4">
          <Text variant="titleSmall" className="px-1">
            All your logged devices
          </Text>
        </View>
        <Section label="Current Device">
          {data.current ? (
            <Surface style={{ borderRadius: theme.roundness * 2 }}>
              <DeviceRevokeButton device={data.current} dismissable={false} />
            </Surface>
          ) : (
            <Text variant="labelLarge">No current device</Text>
          )}
        </Section>
        {data.others?.length > 0 ? (
          <Section label="Others Devices" twClass="mt-8">
            <Surface style={{ borderRadius: theme.roundness * 2 }}>
              {data.others.map((device, index) => (
                <Fragment key={device.id.toString()}>
                  <DeviceRevokeButton device={device} refresh={refetch} />
                  {data.others.length - 1 === index ? null : <Divider />}
                </Fragment>
              ))}
            </Surface>
          </Section>
        ) : null}
        <Surface
          style={{ borderRadius: theme.roundness * 2, overflow: "hidden" }}
        >
          <TouchableRipple onPress={logoutAllDevices}>
            <View className="flex flex-col py-3 px-4">
              <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                Log Out All Known Devices
              </Text>
              <Text variant="labelLarge" style={{ color: Colors.muted }}>
                You'll have to log in again on all devices
              </Text>
            </View>
          </TouchableRipple>
        </Surface>
      </ScrollView>
      <Portal>
        <Dialog visible={isLogginOut} dismissable={false}>
          <Dialog.Content>
            <View className="flex flex-row items-center space-x-4">
              <ActivityIndicator animating />
              <Text>Logout...</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}
