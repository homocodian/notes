import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { RouteName, routeNames } from "@/App";
import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";
import SettingsMenu from "@/components/general/SettingsMenu";
import KeyboardShortcut from "@/components/general/KeyboardShortcut";

function AppBar() {
	const { user } = useAuth();
	const { isDrawerOpen, setDrawerIsOpen } = useDrawer();
	const location = useLocation();
	const navigate = useNavigate();

	const navigateTo = (route: RouteName) => navigate(route);

	const shouldShow = !!routeNames.find((item) => item === location.pathname);

	return (
		<Fragment>
			<Box sx={{ flexGrow: 1 }}>
				<Slide direction="down" in={shouldShow}>
					<MuiAppBar position="fixed">
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
							{location.pathname !== "/search" && user?.uid ? (
								<IconButton onClick={() => navigateTo("/search")}>
									<SearchIcon />
								</IconButton>
							) : null}
							<SettingsMenu />
						</Toolbar>
					</MuiAppBar>
				</Slide>
			</Box>
			<KeyboardShortcut />
		</Fragment>
	);
}

export default AppBar;
