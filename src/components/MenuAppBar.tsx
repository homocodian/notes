import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import AccountMenu from "./AccountMenu";
import SelectAppTheme from "./SelectAppTheme";
import { useAuth } from "../context/AuthContext";
import { useDrawer } from "../context/DrawerContext";

function MenuAppBar() {
	const { user } = useAuth();
	const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

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
					<SelectAppTheme />
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default MenuAppBar;
