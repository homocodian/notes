import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import { useTernaryDarkMode } from "usehooks-ts";

function ThemeMenuItem(props: { handleItemClick: (cb?: () => void) => void }) {
  const { setTernaryDarkMode, ternaryDarkMode } = useTernaryDarkMode();

  return (
    <Box>
      <Typography
        sx={{
          paddingLeft: "1rem",
          paddingBottom: "0.5rem",
          color: grey[500],
        }}
        fontSize={14}
      >
        Theme
      </Typography>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <MenuItem
          onClick={() =>
            props.handleItemClick(() => {
              setTernaryDarkMode("light");
            })
          }
        >
          <ListItemIcon>
            {ternaryDarkMode === "light" ? <DoneIcon /> : null}
          </ListItemIcon>
          Light
        </MenuItem>
        <MenuItem
          onClick={() =>
            props.handleItemClick(() => {
              setTernaryDarkMode("dark");
            })
          }
        >
          <ListItemIcon>
            {ternaryDarkMode === "dark" ? <DoneIcon /> : null}
          </ListItemIcon>
          Dark
        </MenuItem>
        <MenuItem
          onClick={() =>
            props.handleItemClick(() => {
              setTernaryDarkMode("system");
            })
          }
        >
          <ListItemIcon>
            {ternaryDarkMode === "system" ? <DoneIcon /> : null}
          </ListItemIcon>
          System
        </MenuItem>
      </Box>
    </Box>
  );
}

export default ThemeMenuItem;
