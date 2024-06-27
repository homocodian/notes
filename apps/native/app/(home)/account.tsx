import React from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Portal,
  Text
} from "react-native-paper";

import { UserAvater } from "@/components/user-avatar";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";

export default function Account() {
  const theme = useAppTheme();
  const { user, signOut } = useAuth();
  const [visible, setVisible] = React.useState(false);

  async function logout() {
    setVisible(true);
    await signOut();
    setVisible(false);
  }

  return (
    <View className="flex-1 p-4">
      <View className="space-y-4">
        <Text className="font-bold px-2" variant="titleMedium">
          Account
        </Text>
        <View className="space-y-6">
          <Card
            className="border"
            style={{
              borderColor: theme.colors.primary
            }}
          >
            <Card.Content className="flex flex-row gap-2 p-2">
              <View className="flex justify-center items-center">
                <UserAvater />
              </View>
              <View className="flex justify-center items-center">
                <Text className="font-bold">{user?.name ?? user?.email}</Text>
              </View>
            </Card.Content>
          </Card>
          <Button mode="contained" onPress={logout} disabled={visible}>
            Logout
          </Button>
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
    </View>
  );
}
