import React from "react";

import { getLatestRelease } from "@/utils/get-latest-release";
import CustomSnackbar from "../CustomSnackbar";
import { Capacitor } from "@capacitor/core";

type Alert = {
	type: React.ComponentProps<typeof CustomSnackbar>["alertType"];
	message: React.ComponentProps<typeof CustomSnackbar>["message"];
	open: React.ComponentProps<typeof CustomSnackbar>["open"];
};

function CheckForUpdates() {
	const [alert, setAlert] = React.useState<Alert>({
		type: "error",
		message: "",
		open: false,
	});

	const checkForUpdate = React.useCallback(async () => {
		try {
			const data = await getLatestRelease();
			if (
				data.status === 200 &&
				data.data.target_commitish === "main" &&
				data.data.draft === false &&
				Number(data.data?.name?.substring(1)?.split(".")?.join("")) >
					Number(import.meta.env.VITE_RELEASE_NUMBER)
			) {
				setAlert({
					open: true,
					message: `New update available ${data.data.html_url}`,
					type: "info",
				});
			} else {
				setAlert({
					open: true,
					message: `There are currently no new updates available.`,
					type: "info",
				});
			}
		} catch (error) {
			setAlert({
				open: true,
				message: "Failed to check for update.",
				type: "error",
			});
		}
	}, []);

	React.useEffect(() => {
		if (Capacitor.getPlatform() === "web") return;
		checkForUpdate();
	}, [checkForUpdate]);

	return (
		<CustomSnackbar
			open={alert.open}
			setOpen={(prop) =>
				setAlert((prev) => ({ ...prev, open: prop, message: "" }))
			}
			alertType={alert.type}
			message={alert.message}
			anchorPosition={{ vertical: "bottom", horizontal: "center" }}
		/>
	);
}

export default CheckForUpdates;
