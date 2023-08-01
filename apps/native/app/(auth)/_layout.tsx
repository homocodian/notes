import React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";

function AuthLayout() {
	return (
		<Stack
			initialRouteName="sign-in"
			screenOptions={{
				headerShown: false,
				animation: Platform.OS === "android" ? "slide_from_right" : undefined,
			}}
		/>
	);
}

export default AuthLayout;
