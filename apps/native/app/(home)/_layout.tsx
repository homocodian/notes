import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(drawer)"
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="(drawer)" />
      <Stack.Screen
        name="account"
        options={{
          headerShown: true,
          title: "Account"
        }}
      />
      <Stack.Screen
        name="edit-account-info-modal"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom"
        }}
      />
    </Stack>
  );
}
