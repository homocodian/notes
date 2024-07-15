import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";

import DrawerContent from "@/components/drawer-content";
import NavigationBar from "@/components/navigation-bar";
import { useSync } from "@/hooks/use-sync";

export const unstable_settings = {
  initialRouteName: "index"
};

export default function AppLayout() {
  useSync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: (props) => <NavigationBar {...props} />
        }}
        drawerContent={DrawerContent}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="general" options={{ title: "General" }} />
        <Drawer.Screen name="important" options={{ title: "Important" }} />
        <Drawer.Screen name="shared" options={{ title: "Shared" }} />
        <Drawer.Screen
          name="search"
          options={{ title: "Search", headerShown: false, unmountOnBlur: true }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
