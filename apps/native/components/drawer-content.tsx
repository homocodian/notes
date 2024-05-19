import React from "react";

import { Drawer } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(props: DrawerContentComponentProps) {
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
				flex: 1,
			}}
			showDivider={false}
		>
			<Drawer.Item
				label="Home"
				icon="home"
				active={active === 0}
				onPress={() => {
					navigate("index");
				}}
			/>
			<Drawer.Item
				label="Details"
				icon="details"
				active={active === 1}
				onPress={() => {
					navigate("details");
				}}
			/>
		</Drawer.Section>
	);
}
