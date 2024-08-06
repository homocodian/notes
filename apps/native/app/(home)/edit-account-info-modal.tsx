import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Devices } from "@/components/account/devices";
import { EditAccountName } from "@/components/account/edit/name";
import { UpdateAccountPassword } from "@/components/account/edit/password";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";

export default function EditAccountModal() {
  const data = useLocalSearchParams<{ to: string }>();
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-row">
        <IconButton
          icon={(props) => <Ionicons name="close" {...props} />}
          onPress={() => router.dismiss()}
          size={28}
        />
      </View>
      <View
        style={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING + 5,
          paddingVertical: SCREEN_VERTICAL_PADDING
        }}
        className="flex-1"
      >
        <RenderComponent name={data.to} />
      </View>
    </SafeAreaView>
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
