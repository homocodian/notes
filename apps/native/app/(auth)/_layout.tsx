import React from "react";
import { Platform } from "react-native";

import { Stack } from "expo-router";

function AuthLayout() {
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "android" ? "slide_from_right" : undefined
      }}
    />
  );
}

export default AuthLayout;
