import InitialsAvatar from "@/components/InitialsAvatar";
import { useAuthStore } from "@/store/auth";

function ProfileAvatar() {
  const user = useAuthStore((state) => state.user);

  return <InitialsAvatar name={user?.email ?? "Unknown"} />;
}

export default ProfileAvatar;
