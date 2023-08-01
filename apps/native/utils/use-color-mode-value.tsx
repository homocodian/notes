import { useColorScheme } from "react-native";

export function useColorModeValue<T>(light: T, dark: T) {
	const colorScheme = useColorScheme();
	if (colorScheme === "dark") {
		return dark;
	}
	return light;
}
