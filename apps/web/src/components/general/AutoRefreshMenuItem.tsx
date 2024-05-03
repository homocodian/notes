import DoneIcon from "@mui/icons-material/Done";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import { ComponentProps } from "react";
import { useLocalStorage } from "usehooks-ts";

export function AutoRefreshMenuItem(props: ComponentProps<typeof MenuItem>) {
  const [isAutoRefresh, setIsAutoRefresh] = useLocalStorage(
    "auto-refresh",
    true,
  );

  return (
    <MenuItem
      {...props}
      onClick={() => {
        setIsAutoRefresh((old) => !old);
      }}
    >
      <ListItemIcon>{isAutoRefresh ? <DoneIcon /> : null}</ListItemIcon>
      Auto refresh
    </MenuItem>
  );
}
