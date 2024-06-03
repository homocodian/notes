import { Avatar, IconButton } from "react-native-paper";

import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { getInitials } from "@/utils/get-initials";

const AVATAR_SIZE = 34;

export function UserAvater() {
  const { user } = useAuth();
  const theme = useAppTheme();

  if (!user) {
    return <IconButton icon="account-question" />;
  }

  if (!user.imageUrl) {
    const name = user.name ?? user.email ?? "Unknown";
    const label = getInitials(name);

    return (
      <IconButton
        icon={(props) => (
          <Avatar.Text
            {...props}
            label={label}
            size={AVATAR_SIZE}
            labelStyle={{
              fontWeight: "bold",
              color: theme.colors.onPrimary
            }}
          />
        )}
      />
    );
  }

  return (
    <IconButton
      icon={() => (
        <Avatar.Image size={AVATAR_SIZE} source={{ uri: user.imageUrl }} />
      )}
    />
  );
}
