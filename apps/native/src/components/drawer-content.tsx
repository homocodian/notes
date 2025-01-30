import React from "react";
import { Drawer } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DrawerContentComponentProps } from "@react-navigation/drawer";

import { useAppTheme } from "@/context/material-3-theme-provider";

export default function DrawerContent(props: DrawerContentComponentProps) {
  const theme = useAppTheme();
  const active = props.state.index;
  const insets = useSafeAreaInsets();

  function navigate(screen: string) {
    props.navigation.closeDrawer();
    props.navigation.navigate(screen);
  }

  return (
    <Drawer.Section
      title="Cinememo"
      style={{
        paddingTop: insets.top,
        flex: 1
      }}
      showDivider={false}
      theme={theme}
    >
      <Drawer.Item
        label="Home"
        icon="home"
        active={active === 0}
        onPress={() => {
          navigate("Home");
        }}
      />
      <Drawer.Item
        label="General"
        icon="web"
        active={active === 1}
        onPress={() => {
          navigate("General");
        }}
      />
      <Drawer.Item
        label="Important"
        icon="star"
        active={active === 2}
        onPress={() => {
          navigate("Important");
        }}
      />
      <Drawer.Item
        label="Shared"
        icon="link-variant"
        active={active === 3}
        onPress={() => {
          navigate("Shared");
        }}
      />
    </Drawer.Section>
  );
}
