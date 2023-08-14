import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";
import SettingsMenu from "@/components/general/SettingsMenu";

function AppBar() {
	const { user } = useAuth();
	const { isDrawerOpen, setDrawerIsOpen } = useDrawer();

	return (
		<Box sx={{ flexGrow: 1 }}>
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
					<SettingsMenu />
				</Toolbar>
			</MuiAppBar>
		</Box>
	);
}

export default AppBar;
