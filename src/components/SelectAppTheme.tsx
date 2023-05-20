import { Fragment, useState, MouseEvent, useCallback } from "react";

import {
	Menu,
	Radio,
	IconButton,
	FormControl,
	RadioGroup,
	FormControlLabel,
	MenuItem,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTernaryDarkMode } from "usehooks-ts";

import CustomTooltip from "./CustomTooltip";
import { DarkModeOutlined } from "@mui/icons-material";

type TernaryDarkMode = "system" | "light" | "dark";

function SelectAppTheme() {
	const { setTernaryDarkMode, ternaryDarkMode, isDarkMode } =
		useTernaryDarkMode();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleThemeChange = useCallback((mode: TernaryDarkMode) => {
		setTernaryDarkMode(mode);
		handleClose();
	}, []);

	return (
		<Fragment>
			<IconButton
				size="large"
				id="theme-toggle-button"
				aria-label="toggle theme"
				aria-controls={open ? "theme-toggle-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				color="inherit"
			>
				<CustomTooltip title="Switch color Mode">
					{!isDarkMode ? <LightModeIcon /> : <DarkModeOutlined />}
				</CustomTooltip>
			</IconButton>
			<Menu
				id="theme-toggle-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "theme-toggle-button",
				}}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
						minWidth: 180,
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<FormControl fullWidth>
					<RadioGroup
						aria-labelledby="select app theme"
						name="select app theme"
						value={ternaryDarkMode}
					>
						<MenuItem onClick={() => handleThemeChange("system")}>
							<FormControlLabel
								value="system"
								control={<Radio />}
								label="Device"
							/>
						</MenuItem>
						<MenuItem onClick={() => handleThemeChange("light")}>
							<FormControlLabel
								value="light"
								control={<Radio />}
								label="Light"
							/>
						</MenuItem>
						<MenuItem onClick={() => handleThemeChange("dark")}>
							<FormControlLabel value="dark" control={<Radio />} label="Dark" />
						</MenuItem>
					</RadioGroup>
				</FormControl>
			</Menu>
		</Fragment>
	);
}

export default SelectAppTheme;
