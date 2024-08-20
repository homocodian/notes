import React from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Divider,
  Portal,
  Surface,
  Text,
  TouchableRipple
} from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import * as Application from "expo-application";

import { CardButton } from "@/components/account/card-button";
import { Section } from "@/components/section";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { toast } from "@/lib/toast";

const ADMIN_EMAILS = process.env.EXPO_PUBLIC_ADMIN_EMAIL?.split(",");

export default function Settings() {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  const [visible, setVisible] = React.useState(false);

  async function logout() {
    setVisible(true);
    await signOut();
    setVisible(false);
  }

  function testError() {
    try {
      throw new Error(`Test Error ${new Date()}}`);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  function nativeCrash() {
    Sentry.nativeCrash();
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
                  navigation.navigate("EditProfile", { to: "Name" })
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
                  navigation.navigate("EditProfile", { to: "Password" })
                }
              />
              <Divider />
              <CardButton
                label="Devices"
                onPress={() => navigation.navigate("Devices")}
              />
            </Surface>
          </Section>

          <Surface
            style={{ borderRadius: theme.roundness * 2 }}
            className="overflow-hidden"
          >
            <TouchableRipple onPress={logout} disabled={visible}>
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
            </TouchableRipple>
          </Surface>

          {user?.email && ADMIN_EMAILS?.includes(user.email) ? (
            <Section label="Account Settings" twClass="mt-5">
              <Surface
                style={{ borderRadius: theme.roundness * 2 }}
                className="overflow-hidden"
              >
                <TouchableRipple onPress={testError}>
                  <View className="flex flex-row items-center py-4 px-4 space-x-4">
                    <MaterialIcons
                      name="error"
                      size={24}
                      color={theme.colors.onSurface}
                    />
                    <Text
                      variant="labelLarge"
                      style={{ color: theme.colors.error }}
                    >
                      Test Error
                    </Text>
                  </View>
                </TouchableRipple>
                <Divider />
                <TouchableRipple onPress={nativeCrash}>
                  <View className="flex flex-row items-center py-4 px-4 space-x-4">
                    <MaterialIcons
                      name="error"
                      size={24}
                      color={theme.colors.onSurface}
                    />
                    <Text
                      variant="labelLarge"
                      style={{ color: theme.colors.error }}
                    >
                      Test Native Error
                    </Text>
                  </View>
                </TouchableRipple>
              </Surface>
            </Section>
          ) : null}
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
