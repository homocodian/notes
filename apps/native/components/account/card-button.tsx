import { TouchableOpacityProps, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Feather } from "@expo/vector-icons";

import { useAppTheme } from "@/context/material-3-theme-provider";

interface CardButtonProps extends TouchableOpacityProps {
  label: string;
  value?: string;
}

export function CardButton({ label, value, ...props }: CardButtonProps) {
  const theme = useAppTheme();

  return (
    <TouchableRipple {...props}>
      <View className="flex flex-row justify-between items-center py-4 px-4">
        <Text variant="labelLarge">{label}</Text>
        <View className="flex flex-row justify-center items-center space-x-2">
          {value ? <Text>{value}</Text> : null}
          <Feather
            name="chevron-right"
            size={18}
            color={theme.colors.onSurface}
          />
        </View>
      </View>
    </TouchableRipple>
  );
}
