import { Button } from "react-native-paper";

import { StackActions, useNavigation } from "@react-navigation/native";

type HeaderNavButtonProps = {
  label: string;
  screen: "SignIn" | "SignUp";
};

export function HeaderNavButton({ label, screen }: HeaderNavButtonProps) {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => navigation.dispatch(StackActions.replace(screen))}
      mode="text"
    >
      {label}
    </Button>
  );
}
