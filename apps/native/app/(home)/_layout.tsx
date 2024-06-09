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
          animation: "fade_from_bottom",
          title: "Account"
        }}
      />
    </Stack>
  );
}
