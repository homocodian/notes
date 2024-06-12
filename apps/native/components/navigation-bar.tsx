import React from "react";
import { Pressable, View } from "react-native";
import { IconButton, Surface, Text, Tooltip } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DrawerHeaderProps } from "@react-navigation/drawer";
import { Link } from "expo-router";

import { SCREEN_HORIZONTAL_PADDING, TOP_PADDING } from "@/constant/screens";

import { UserAvater } from "./user-avatar";

export default function NavigationBar(props: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + TOP_PADDING,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + SCREEN_HORIZONTAL_PADDING,
        paddingRight: insets.right + SCREEN_HORIZONTAL_PADDING
      }}
    >
      <Surface className="flex-row items-center rounded-full overflow-hidden flex">
        <View className="self-end">
          <Tooltip title="Open navigation drawer">
            <IconButton
              icon="menu"
              onPress={() => {
                props.navigation.toggleDrawer();
              }}
            />
          </Tooltip>
        </View>
        <View className="relative flex-1">
          <Link href="/search" asChild>
            <Pressable className="flex-1 flex justify-center">
              <Text>Search</Text>
            </Pressable>
          </Link>
        </View>
        <Link asChild href="/../account">
          <Pressable>
            <View className="self-end">
              <UserAvater />
            </View>
          </Pressable>
        </Link>
      </Surface>
    </View>
  );
}
