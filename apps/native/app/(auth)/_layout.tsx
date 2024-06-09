import React from "react";

import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "sign-in"
};

function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false, title: "Sign In" }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerTransparent: true,
          title: ""
        }}
      />
    </Stack>
  );
}

export default AuthLayout;
