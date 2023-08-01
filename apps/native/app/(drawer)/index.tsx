import React from "react";
import { Link } from "expo-router";
import { StyleSheet, Pressable } from "react-native";

import { Text, View } from "@/components/Themed";
import EditScreenInfo from "@/components/EditScreenInfo";

export default function HomeScreen() {
	return (
		<React.Fragment>
			<View style={styles.container}>
				<Text style={styles.title}>Modal</Text>
				<View
					style={styles.separator}
					lightColor="#eee"
					darkColor="rgba(255,255,255,0.1)"
				/>
				<EditScreenInfo path="app/modal.tsx" />
				{/* @ts-expect-error */}
				<Link href={{ pathname: "details", params: { name: "Bacon" } }} asChild>
					<Pressable>
						<Text>Go to Details</Text>
					</Pressable>
				</Link>
			</View>
			{/* <CustomDrawer /> */}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
