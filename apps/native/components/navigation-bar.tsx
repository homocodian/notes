import React from "react";
import { IconButton, Surface, Text, Tooltip } from "react-native-paper";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { UserAvater } from "./user-avatar";

const TOP_PADDING = 10;
const HORIZONTAL_PADDING = 10;

export default function NavigationBar(props: DrawerHeaderProps) {
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				paddingTop: insets.top + TOP_PADDING,
				paddingBottom: insets.bottom,
				paddingLeft: insets.left + HORIZONTAL_PADDING,
				paddingRight: insets.right + HORIZONTAL_PADDING,
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
				<Text className="flex-1">Search</Text>
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
