import { Stack } from "expo-router";

export default function HomeLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }} initialRouteName="(drawer)">
			<Stack.Screen name="(drawer)" />
			<Stack.Screen
				name="account"
				options={{
					headerShown: true,
					animation: "fade_from_bottom",
					title: "Account",
				}}
			/>
		</Stack>
	);
}
