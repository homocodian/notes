import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { Stack, useLocalSearchParams } from "expo-router";

import { Devices } from "@/components/account/devices";
import { EditAccountName } from "@/components/account/edit/name";
import { UpdateAccountPassword } from "@/components/account/edit/password";

export default function EditAccountModal() {
  const data = useLocalSearchParams<{ to: string }>();
  return (
    <>
      <Stack.Screen options={{ title: data.to }} />
      <RenderComponent name={data.to} />
    </>
  );
}

function RenderComponent({ name }: { name: string }) {
  switch (name) {
    case "Name":
      return <EditAccountName />;

    case "Password":
      return <UpdateAccountPassword />;

    case "Devices":
      return <Devices />;

    default:
      return (
        <View className="flex justify-center items-center">
          <Text>Not found!</Text>
        </View>
      );
  }
}
