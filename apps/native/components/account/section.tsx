import { View } from "react-native";
import { Text } from "react-native-paper";

import { Colors } from "@/constant/colors";

export function Section({
  children,
  label,
  twClass
}: {
  children: React.ReactNode;
  label: string;
  twClass?: string;
}) {
  return (
    <View className={`space-y-2 ${twClass ?? ""}`}>
      <Text
        variant="labelMedium"
        className="pl-2"
        style={{ color: Colors.muted }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}
