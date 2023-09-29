import { useState, Fragment, useCallback } from "react";

import Box from "@mui/system/Box";
import { useHotkeys } from "react-hotkeys-hook";

import Notes from "@/components/main/Notes";
import Profile from "@/components/Profile";
import AddButton from "@/components/main/AddButton";
import AlertMessage from "@/components/AlertMessage";
import SideDrawer from "@/components/main/SideDrawer";
import AddNoteModal from "@/components/main/AddNoteModal";
import { useAccountMenu } from "@/context/AccountMenuContext";
import {
	changeStatusbarColor,
	setStatusbarColor,
} from "@/utils/change-statusbar-color";
import { useTernaryDarkMode } from "usehooks-ts";
import { Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

const PaddingTop = Capacitor.isNativePlatform() ? 1 : 2;

function Home() {
	const { isDarkMode } = useTernaryDarkMode();
	const accountMenuOptions = useAccountMenu();
	const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

	const handleAddNoteModalState = useCallback(
		(prop: boolean) => {
			setIsNoteModalOpen(prop);
			if (prop === true) {
				const color = isDarkMode ? "#383838" : "#ffffff";
				const style = isDarkMode ? Style.Dark : Style.Light;
				setStatusbarColor(color, style);
			} else {
				changeStatusbarColor(isDarkMode);
			}
		},
		[isDarkMode, Style]
	);

	useHotkeys(
		"shift+n",
		() => {
			if (isNoteModalOpen) {
				return;
			}
			setIsNoteModalOpen(true);
		},
		[isNoteModalOpen]
	);

	return (
		<Fragment>
			<Box
				sx={{
					display: "flex",
					width: "100%",
					paddingBottom: "15px",
				}}
			>
				<SideDrawer />
				<Box sx={{ width: "100%" }} pt={PaddingTop}>
					<Notes />
				</Box>
				<Profile
					isOpen={accountMenuOptions.isProfileOpen}
					setIsOpen={accountMenuOptions.setIsProfileOpen}
				/>
				<AddNoteModal
					open={isNoteModalOpen}
					setOpen={handleAddNoteModalState}
				/>
				<AlertMessage
					open={accountMenuOptions.isError}
					setOpen={accountMenuOptions.setIsError}
					message="Logout error, please try later."
				/>
			</Box>
			<AddButton openAddTodoModal={handleAddNoteModalState} />
		</Fragment>
	);
}

export default Home;
