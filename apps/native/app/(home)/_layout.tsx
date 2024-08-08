import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/auth";

export const unstable_settings = {
  initialRouteName: "(drawer)"
};

export default function HomeLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="note/editor"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account"
        }}
      />
      <Stack.Screen name="edit-account-info-modal" />
    </Stack>
  );
}
