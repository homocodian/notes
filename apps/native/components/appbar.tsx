import React from "react";
import { View } from "react-native";
import {
  IconButton,
  Surface,
  Text,
  Tooltip,
  TouchableRipple
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DrawerHeaderProps } from "@react-navigation/drawer";
import { Link } from "expo-router";

import { Colors } from "@/constant/colors";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";

import { UserAvater } from "./user-avatar";

export function Appbar(props: DrawerHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 5,
        paddingBottom: insets.bottom + SCREEN_VERTICAL_PADDING,
        paddingLeft: insets.left + SCREEN_HORIZONTAL_PADDING,
        paddingRight: insets.right + SCREEN_HORIZONTAL_PADDING
      }}
    >
      <Surface className="rounded-full overflow-hidden">
        <Link asChild href="/search">
          <TouchableRipple onPress={() => {}}>
            <View className="flex-row items-center flex">
              <View className="self-center">
                <Tooltip title="Open navigation drawer">
                  <IconButton
                    icon="menu"
                    onPress={() => {
                      props.navigation.toggleDrawer();
                    }}
                    size={26}
                  />
                </Tooltip>
              </View>
              <View className="relative flex-1">
                <Text style={{ color: Colors.muted }} variant="bodyLarge">
                  Search
                </Text>
              </View>
              <View className="self-center">
                <Link asChild href="/../account">
                  <IconButton
                    icon={(props) => <UserAvater {...props} />}
                    size={28}
                  />
                </Link>
              </View>
            </View>
          </TouchableRipple>
        </Link>
      </Surface>
    </View>
  );
}
