import React from "react";
import { View } from "react-native";

import { Button, Card, Text, useTheme } from "react-native-paper";

import { UserAvater } from "@/components/user-avatar";
import { useAuth } from "@/context/auth";

export default function Account() {
	const theme = useTheme();
	const { user, signOut } = useAuth();
	const [isLoading, setIsLoading] = React.useState(false);

	async function logout() {
		setIsLoading(true);
		await signOut();
		setIsLoading(false);
	}

	return (
		<View className="flex-1 p-4">
			<View className="space-y-4">
				<Text className="font-bold px-2" variant="titleMedium">
					Account
				</Text>
				<View className="space-y-6">
					<Card
						className="border"
						style={{
							borderColor: theme.colors.primary,
						}}
					>
						<Card.Content className="flex flex-row gap-2 p-2">
							<View className="flex justify-center items-center">
								<UserAvater />
							</View>
							<View className="flex justify-center items-center">
								<Text className="font-bold">{user?.name || user?.email}</Text>
							</View>
						</Card.Content>
					</Card>
					<Button
						mode="contained"
						loading={isLoading}
						onPress={logout}
						disabled={isLoading}
					>
						Logout
					</Button>
				</View>
			</View>
		</View>
	);
}
