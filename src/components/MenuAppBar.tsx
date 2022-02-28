import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import AccountMenu from "./AccountMenu";
import { PaletteMode } from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import { useAuth } from "../context/AuthContext";
import { useDrawer } from "../context/DrawerContext";
import { Box, Toolbar, AppBar, Typography, IconButton } from "@mui/material";

type MenuAppBarProps = {
  appThemeMode: string;
  setAppTheme: React.Dispatch<React.SetStateAction<PaletteMode>>;
};

export default function MenuAppBar({
  appThemeMode,
  setAppTheme,
}: MenuAppBarProps) {
  const { user } = useAuth();
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

  const handleTheme = () => {
    if (appThemeMode === "light") setAppTheme("dark");
    else setAppTheme("light");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {user && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                setDrawerIsOpen(!isDrawerOpen);
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes
          </Typography>
          {user ? <AccountMenu /> : null}
          <IconButton
            size="large"
            aria-label="toggle theme"
            onClick={handleTheme}
            color="inherit"
          >
            <CustomTooltip title="Toogle Theme">
              {appThemeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </CustomTooltip>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
