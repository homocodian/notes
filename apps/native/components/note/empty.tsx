import { View } from "react-native";
import { Text } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/context/material-3-theme-provider";

export function EmptyData() {
  const theme = useAppTheme();
  return (
    <View className="flex-1 justify-center items-center gap-2">
      <Ionicons
        name="information-circle-outline"
        size={24}
        color={theme.colors.secondary}
      />
      <Text style={{ color: theme.colors.secondary }}>No data available</Text>
    </View>
  );
}
