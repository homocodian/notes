import { ComponentProps } from "react";
import { Avatar, IconButton } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { getInitials } from "@/utils/get-initials";

type IconProps = ComponentProps<typeof IconButton>["icon"];

type UserAvaterProps = Parameters<Extract<IconProps, Function>>[number];

export function UserAvater(props: UserAvaterProps) {
  const { user } = useAuth();
  const theme = useAppTheme();

  if (!user) {
    return <MaterialIcons name="account-circle" {...props} />;
  }

  if (user.photoURL) {
    return (
      <Avatar.Image {...props} source={{ uri: user.photoURL as string }} />
    );
  }

  const name = user.displayName ?? user.email ?? "Unknown";
  const label = getInitials(name);

  return (
    <Avatar.Text
      {...props}
      label={label}
      labelStyle={{
        fontWeight: "bold",
        color: theme.colors.onPrimary
      }}
    />
  );
}
