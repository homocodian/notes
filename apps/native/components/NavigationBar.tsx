import React from "react";

import { Appbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { DrawerHeaderProps } from "@react-navigation/drawer";

export default function NavigationBar(props: DrawerHeaderProps) {
	const title = getHeaderTitle(props.options, props.route.name);

	return (
		<Appbar.Header>
			<Appbar.Action icon="menu" onPress={props.navigation.toggleDrawer} />
			<Appbar.Content title={title} />
		</Appbar.Header>
	);
}
