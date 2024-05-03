import { ConnectionStatus, Network } from "@capacitor/network";
import { useEffect, useState } from "react";

export function useOnlineStatus() {
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
