import Avatar from "@mui/material/Avatar";

import InitialsAvatar from "@/components/InitialsAvatar";
import { useAuthStore } from "@/store/auth";

function ProfileAvatar() {
  const user = useAuthStore((state) => state.user);

  if (user && user.photoURL) {
    return (
      <Avatar
        src={user.photoURL}
        alt={user.displayName ? user.displayName : user.email ? user.email : ""}
        sx={{ width: 30, height: 30 }}
      />
    );
  }

  return (
    <InitialsAvatar name={user?.displayName || user?.email || "Unknown"} />
  );
}

export default ProfileAvatar;
