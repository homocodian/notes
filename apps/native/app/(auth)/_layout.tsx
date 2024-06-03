import React from "react";

import { Stack } from "expo-router";

function AuthLayout() {
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false
      }}
    />
  );
}

export default AuthLayout;
