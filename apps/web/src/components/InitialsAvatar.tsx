import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

type InitialsAvatarProps = {
	name: string | null | undefined;
};

// takes name and returns hex code of color
function stringToColor(string: string) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.substr(-2);
	}
	/* eslint-enable no-bitwise */

	return color;
}

// takes string and return first letter of string
function stringAvatar(name: string) {
	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children:
			name.split(" ").length > 1
				? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`.toUpperCase()
				: `${name.split(" ")[0][0]}${name.split(" ")[0][1]}`.toUpperCase(),
	};
}

// Profile avatar
export default function InitialsAvatar({ name }: InitialsAvatarProps) {
	if (!name) {
		return <Avatar sx={{ width: 30, height: 30 }} />;
	}
	return (
		<Avatar {...stringAvatar(name)} alt={name} sx={{ width: 30, height: 30 }} />
	);
}
