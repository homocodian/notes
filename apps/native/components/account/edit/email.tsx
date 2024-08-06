import { View } from "react-native";

import { useUserStore } from "@/lib/store/user";

export function EditAccountEmail() {
  const user = useUserStore((state) => state.user);
  return <View>EditAccountName</View>;
}
