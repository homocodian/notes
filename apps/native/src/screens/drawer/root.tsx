import React from "react";

import type { RootDrawerParamsList } from "@/types/navigation";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { Appbar } from "@/components/appbar";
import DrawerContent from "@/components/drawer-content";
import { AddNoteButton } from "@/components/note/add-button";
import { useSync } from "@/hooks/use-sync";

import GeneralScreen from "./general";
import HomeScreen from "./home";
import ImportantScreen from "./important";
import SharedScreen from "./shared";

const Drawer = createDrawerNavigator<RootDrawerParamsList>();

export default function Root() {
  useSync();

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          header: (props) => <Appbar {...props} />
        }}
        drawerContent={DrawerContent}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="General" component={GeneralScreen} />
        <Drawer.Screen name="Important" component={ImportantScreen} />
        <Drawer.Screen name="Shared" component={SharedScreen} />
      </Drawer.Navigator>
      <AddNoteButton />
    </>
  );
}
