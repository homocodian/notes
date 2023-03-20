import { useEffect, useRef, useState } from "react";

import { Box, Typography } from "@mui/material";

import { useOnlineStatus } from "../../hooks";

function Connectivity() {
	const isOnline = useOnlineStatus();
	const [showMessage, setShowMessage] = useState(false);
	const prevNetworkStatus = useRef<boolean | undefined>(undefined);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (isOnline && prevNetworkStatus.current === undefined) {
			return;
		} else {
			prevNetworkStatus.current = isOnline;
		}

		setShowMessage(true);

		timer = setTimeout(() => {
			setShowMessage(false);
		}, 5000);

		return () => {
			clearTimeout(timer);
		};
	}, [isOnline]);

	if (!showMessage) {
		return null;
	}

	if (showMessage && isOnline) {
		return (
			<Box
				position="fixed"
				bottom={0}
				left={0}
				right={0}
				textAlign="center"
				bgcolor="#16a34a"
			>
				<Typography
					variant="body2"
					textAlign="center"
					color="#fff"
					textTransform="capitalize"
				>
					Back Online
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			position="fixed"
			bottom={0}
			left={0}
			right={0}
			textAlign="center"
			bgcolor="#121212"
		>
			<Typography
				variant="body2"
				textAlign="center"
				color="#fff"
				textTransform="capitalize"
			>
				No Connection
			</Typography>
		</Box>
	);
}

export default Connectivity;
