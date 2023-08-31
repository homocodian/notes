import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";

import { useAuth } from "@/context/AuthContext";
import InitialsAvatar from "@/components/InitialsAvatar";

function ProfileAvatar() {
	const { user } = useAuth();

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
