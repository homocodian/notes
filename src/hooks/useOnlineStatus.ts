import { useEffect, useState } from "react";
import { ConnectionStatus, Network } from "@capacitor/network";

function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		function onStatusChange(status: ConnectionStatus) {
			setIsOnline(status.connected);
		}

		Network.addListener("networkStatusChange", onStatusChange);

		return () => {
			Network.addListener("networkStatusChange", onStatusChange);
		};
	}, []);
	return isOnline;
}

export default useOnlineStatus;
