import React from "react";
import { View } from "react-native";
import {
  IconButton,
  Surface,
  Text,
  Tooltip,
  TouchableRipple
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { DrawerHeaderProps } from "@react-navigation/drawer";

import { Colors } from "@/constant/colors";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";

import { UserAvater } from "./user-avatar";

export function Appbar({ navigation }: DrawerHeaderProps) {
  return (
    <SafeAreaView>
      <View
        style={{
          paddingTop: 5,
          paddingBottom: SCREEN_VERTICAL_PADDING,
          paddingLeft: SCREEN_HORIZONTAL_PADDING,
          paddingRight: SCREEN_HORIZONTAL_PADDING
        }}
      >
        <Surface className="rounded-full overflow-hidden">
          <TouchableRipple
            onPress={() => {
              navigation.navigate("Search");
            }}
          >
            <View className="flex-row items-center flex">
              <View className="self-center">
                <Tooltip title="Open navigation drawer">
                  <IconButton
                    icon="menu"
                    onPress={() => {
                      navigation.toggleDrawer();
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
                <IconButton
                  icon={(props) => <UserAvater {...props} />}
                  size={28}
                  onPress={() => navigation.navigate("Settings")}
                />
              </View>
            </View>
          </TouchableRipple>
        </Surface>
      </View>
    </SafeAreaView>
  );
}
