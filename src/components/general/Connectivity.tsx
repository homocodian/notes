import { useEffect, useRef, useState } from "react";

import { Box, Slide, Typography, colors } from "@mui/material";

import { useOnlineStatus } from "@/hooks";

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

  return (
    <Slide direction="up" in={showMessage}>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        textAlign="center"
        bgcolor={isOnline ? colors.green[500] : colors.common.black}
      >
        <Typography
          variant="body2"
          textAlign="center"
          color="#fff"
          textTransform="capitalize"
        >
          {isOnline ? "Back online" : "No Connection"}
        </Typography>
      </Box>
    </Slide>
  );
}

export default Connectivity;
