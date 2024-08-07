import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawer)"
};

export default function HomeLayout() {
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
