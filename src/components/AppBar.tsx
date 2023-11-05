import { Fragment, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";

import ClearIcon from "@mui/icons-material/Clear";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { routeNames } from "@/Routes";
import Searchbar from "@/components/Searchbar";
import KeyboardShortcut from "@/components/general/KeyboardShortcut";
import SettingsMenu from "@/components/general/SettingsMenu";
import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";

function AppBar() {
  const nodeRef = useRef();
  const { user } = useAuth();
  const location = useLocation();
  const { isDrawerOpen, setDrawerIsOpen } = useDrawer();
  const [shouldShowToolbar, setShouldShowToolbar] = useState(true);
  const [shouldShowSearchbar, setShouldShowSearchbar] = useState(false);

  const shouldShow = useMemo(() => {
    return !!routeNames.find((item) => item === location.pathname);
  }, [location.pathname]);

  return (
    <Fragment>
      <Slide direction="down" in={shouldShow}>
        <MuiAppBar position="fixed">
          <Box ref={nodeRef} overflow="hidden" flexGrow={1}>
            <Toolbar>
              <Slide
                direction="down"
                in={shouldShowToolbar}
                mountOnEnter
                unmountOnExit
                container={nodeRef.current}
                onExited={() => setShouldShowSearchbar(true)}
              >
                <Box
                  flexGrow={1}
                  display="flex"
                  alignItems="center"
                  position="relative"
                >
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
                  <Typography
                    component="div"
                    variant="h6"
                    sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                  >
                    Notes
                  </Typography>
                  <IconButton onClick={() => setShouldShowToolbar(false)}>
                    <SearchIcon htmlColor="#fff" />
                  </IconButton>
                  <SettingsMenu />
                </Box>
              </Slide>
              <Slide
                direction="up"
                in={shouldShowSearchbar}
                mountOnEnter
                unmountOnExit
                container={nodeRef.current}
                onExited={() => {
                  setShouldShowToolbar(true);
                }}
              >
                <Box
                  flexGrow={1}
                  display="flex"
                  alignItems="center"
                  position="relative"
                  justifyContent="space-between"
                  gap="1rem"
                >
                  <Searchbar />
                  <IconButton onClick={() => setShouldShowSearchbar(false)}>
                    <ClearIcon htmlColor="#fff" />
                  </IconButton>
                </Box>
              </Slide>
            </Toolbar>
          </Box>
        </MuiAppBar>
      </Slide>
      <KeyboardShortcut />
    </Fragment>
  );
}

export default AppBar;
