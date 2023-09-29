import { useCallback, useEffect, useState } from "react";

import { checkForUpdates } from "@/utils/get-latest-release";
import CustomSnackbar from "@/components/CustomSnackbar";
import { Capacitor } from "@capacitor/core";

function CheckForUpdates() {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");

	const checkForUpdate = useCallback(async () => {
		try {
			const data = await checkForUpdates();
			if (!data) return;
			setMessage(`New update available ${data.data.html_url}`);
			setOpen(true);
		} catch (error) {}
	}, []);

	useEffect(() => {
		if (Capacitor.isNativePlatform()) {
			checkForUpdate();
		}
	}, [checkForUpdate]);

	return (
		<CustomSnackbar
			open={open}
			setOpen={setOpen}
			alertType="info"
			message={message}
			anchorPosition={{ vertical: "bottom", horizontal: "center" }}
		/>
	);
}

export default CheckForUpdates;
