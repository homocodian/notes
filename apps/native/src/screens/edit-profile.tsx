import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { EditAccountName } from "@/components/account/edit/name";
import { UpdateAccountPassword } from "@/components/account/edit/password";
import { RootStackScreenProps } from "@/types/navigation";

export default function EditProfile({
  route,
  navigation
}: RootStackScreenProps<"EditProfile">) {
  useLayoutEffect(() => {
    if (route.params?.to) {
      navigation.setOptions({ title: route.params.to });
    }
  }, [route.params?.to]);

  if (route.params?.to === "Name") {
    return <EditAccountName />;
  }
  if (route.params?.to === "Password") {
    return <UpdateAccountPassword />;
  }

  return (
    <View className="flex justify-center items-center">
      <Text>Not found!</Text>
    </View>
  );
}
