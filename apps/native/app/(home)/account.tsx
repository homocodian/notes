import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Divider,
  Portal,
  Surface,
  Text
} from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";

import { CardButton } from "@/components/account/card-button";
import { Section } from "@/components/account/section";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { toast } from "@/lib/toast";

export default function Account() {
  const router = useRouter();
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  const [visible, setVisible] = React.useState(false);

  async function logout() {
    setVisible(true);
    await signOut();
    setVisible(false);
  }

  return (
    <>
      <View
        className="flex-1"
        style={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingVertical: SCREEN_VERTICAL_PADDING
        }}
      >
        <View className="space-y-6">
          <Section label="Account information">
            <Surface
              style={{ borderRadius: theme.roundness * 2, overflow: "hidden" }}
            >
              <CardButton
                label="Display Name"
                value={user?.displayName ?? "Unknown"}
                onPress={() =>
                  router.navigate({
                    pathname: "/edit-account-info-modal",
                    params: { to: "Name" }
                  })
                }
              />
              <Divider />
              <CardButton
                label="Email"
                value={user?.email ?? "Unknown"}
                onPress={() => {
                  toast("Cannot change email address at the moment", {
                    android: { duration: "LONG" }
                  });
                }}
              />
            </Surface>
          </Section>

          <Section label="Account Settings" twClass="mt-5">
            <Surface
              style={{ borderRadius: theme.roundness * 2, overflow: "hidden" }}
            >
              <CardButton
                label="Password"
                onPress={() =>
                  router.navigate({
                    pathname: "/edit-account-info-modal",
                    params: { to: "Password" }
                  })
                }
              />
              <Divider />
              <CardButton
                label="Devices"
                onPress={() =>
                  router.navigate({
                    pathname: "/edit-account-info-modal",
                    params: { to: "Devices" }
                  })
                }
              />
            </Surface>
          </Section>

          <Surface style={{ borderRadius: theme.roundness * 2 }}>
            <TouchableOpacity onPress={logout} disabled={visible}>
              <View className="flex flex-row items-center py-4 px-4 space-x-4">
                <MaterialIcons
                  name="logout"
                  size={24}
                  color={theme.colors.onSurface}
                />
                <Text
                  variant="labelLarge"
                  style={{ color: theme.colors.error }}
                >
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>
          </Surface>
        </View>

        <View className="absolute bottom-3 w-screen flex justify-center items-center">
          <Text variant="titleSmall">
            {`${Application.applicationName} v${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
          </Text>
        </View>
      </View>
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Content>
            <View className="flex flex-row gap-4">
              <ActivityIndicator animating />
              <Text variant="bodyMedium">Logging out...</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}
