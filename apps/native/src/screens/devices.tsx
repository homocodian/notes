import { Fragment, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Divider,
  Portal,
  Surface,
  Text,
  TouchableRipple
} from "react-native-paper";

import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { DeviceRevokeButton } from "@/components/devices/device-rovoke-button";
import { Section } from "@/components/section";
import { Colors } from "@/constant/colors";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { Device } from "@/lib/device";
import { toast } from "@/lib/toast";

type QueryData = { current?: Device; others: Device[] };

export default function Devices() {
  const theme = useAppTheme();
  const { signOut } = useAuth();
  const [isManualRefetch, setIsManualRefetch] = useState(false);
  const { data, isLoading, refetch } = useQuery<QueryData>({
    queryKey: ["devices"],
    queryFn: async () => {
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
      <ScrollView
        className="space-y-4"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingVertical: SCREEN_VERTICAL_PADDING
        }}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefetch}
            onRefresh={() => {
              setIsManualRefetch(true);
              refetch().finally(() => setIsManualRefetch(false));
            }}
          />
        }
      >
        <View className="mb-4">
          <Text variant="titleSmall" className="px-1">
            All your logged devices
          </Text>
        </View>
        <Section label="Current Device">
          {data?.current ? (
            <Surface style={{ borderRadius: theme.roundness * 2 }}>
              <DeviceRevokeButton device={data.current} dismissable={false} />
            </Surface>
          ) : (
            <Text variant="labelLarge">No current device</Text>
          )}
        </Section>
        {data?.others && data.others.length > 0 ? (
          <Section label="Others Devices" twClass="mt-5">
            <Surface style={{ borderRadius: theme.roundness * 2 }}>
              {data?.others.map((device) => (
                <Fragment key={device.id.toString()}>
                  <DeviceRevokeButton device={device} refresh={refetch} />
                  <Divider />
                </Fragment>
              ))}
              <View className="flex flex-row space-x-2 py-4 px-2">
                <View className="flex justify-center items-center">
                  <View
                    style={{
                      backgroundColor: theme.colors.background,
                      height: 36,
                      width: 36
                    }}
                    className="rounded-full flex justify-center items-center"
                  >
                    <FontAwesome6
                      name="exclamation"
                      size={20}
                      color={theme.colors.onBackground}
                    />
                  </View>
                </View>
                <View>
                  <Text variant="titleSmall">
                    Some older devices may not be shown here
                  </Text>
                  <Text variant="bodySmall">
                    To log them out, please{" "}
                    <Link
                      to={{ screen: "EditProfile", params: { to: "Password" } }}
                      style={{
                        color: theme.colors.primary
                      }}
                    >
                      change your password
                    </Link>
                  </Text>
                </View>
              </View>
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
              <Text
                variant="labelLarge"
                style={{ color: theme.dark ? Colors.darkMuted : Colors.muted }}
              >
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
