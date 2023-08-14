import React from "react";

type DrawerValues = {
	isDrawerOpen: boolean;
	setDrawerIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DrawerContext = React.createContext({} as DrawerValues);

export const useDrawer = () => React.useContext(DrawerContext);

type DrawerProviderProps = {
	children: React.ReactNode;
};

function DrawerProvider({ children }: DrawerProviderProps) {
	const [isDrawerOpen, setDrawerIsOpen] = React.useState(false);
	return (
		<DrawerContext.Provider value={{ isDrawerOpen, setDrawerIsOpen }}>
			{children}
		</DrawerContext.Provider>
	);
}

export default DrawerProvider;
