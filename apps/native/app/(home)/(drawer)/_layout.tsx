import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";

import DrawerContent from "@/components/drawer-content";
import NavigationBar from "@/components/navigation-bar";
import { AddNoteButton } from "@/components/note/add-button";

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          header: NavigationBar
        }}
        drawerContent={DrawerContent}
        initialRouteName="index"
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="general" options={{ title: "General" }} />
        <Drawer.Screen name="important" options={{ title: "Important" }} />
        <Drawer.Screen name="shared" options={{ title: "Shared" }} />
      </Drawer>
      <AddNoteButton />
    </GestureHandlerRootView>
  );
}
