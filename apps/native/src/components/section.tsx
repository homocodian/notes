import { View } from "react-native";
import { Text } from "react-native-paper";

import { Colors } from "@/constant/colors";
import { useAppTheme } from "@/context/material-3-theme-provider";

export function Section({
  children,
  label,
  twClass
}: {
  children: React.ReactNode;
  label: string;
  twClass?: string;
}) {
  const theme = useAppTheme();

  return (
    <View className={`space-y-2 ${twClass ?? ""}`}>
      <Text
        variant="labelMedium"
        className="pl-2"
        style={{ color: theme.dark ? Colors.darkMuted : Colors.muted }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}
