import { useEffect, useMemo } from "react";

import loadable from "@loadable/component";
import { Routes, Route } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AppBar from "@/components/AppBar";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import PrivateRoute from "@/components/PrivateRoute";
import DrawerProvider from "@/context/DrawerContext";
import { getDesignTokens } from "@/utils/get-design-token";
import Connectivity from "@/components/general/Connectivity";
import AccountMenuProvider from "@/context/AccountMenuContext";
import { changeStatusbarColor } from "@/utils/change-statusbar-color";
import CheckForUpdates from "@/components/general/CheckForUpdates";
import ThemedToaster from "@/components/ThemedToaster";

const HomePage = loadable(() => import("@/pages/Home"));
const ImportantPage = loadable(() => import("@/pages/Important"));
const SignInPage = loadable(() => import("@/pages/SignIn"));
const SignUpPage = loadable(() => import("@/pages/SignUp"));
const SharedPage = loadable(() => import("@/pages/Shared"));
const GeneralPage = loadable(() => import("@/pages/General"));

const routes = [
	{
		path: "*",
		element: <NotFound />,
	},
	{
		path: "/",
		element: (
			<PrivateRoute>
				<HomePage fallback={<Loading />} />
			</PrivateRoute>
		),
	},
	{
		path: "/general",
		element: (
			<PrivateRoute>
				<GeneralPage fallback={<Loading />} />
			</PrivateRoute>
		),
	},
	{
		path: "/important",
		element: (
			<PrivateRoute>
				<ImportantPage fallback={<Loading />} />
			</PrivateRoute>
		),
	},
	{
		path: "/shared",
		element: (
			<PrivateRoute>
				<SharedPage fallback={<Loading />} />
			</PrivateRoute>
		),
	},
	{
		path: "/login",
		element: <SignInPage fallback={<Loading />} />,
	},
	{ path: "/signup", element: <SignUpPage fallback={<Loading />} /> },
] as const;

type ExcludeWildcardPath<T> = T extends "*" ? never : T;
export type Route = (typeof routes)[number]; // Get the type of a single route object
export type RouteName = ExcludeWildcardPath<Route["path"]>; // Get the type of the 'path' property

export const routeNames = routes
	.map((route) => route.path)
	.filter((path) => path !== "*") as RouteName[];

function App() {
	// get theme value from local storage
	const { isDarkMode } = useTernaryDarkMode();

	const theme = useMemo(() => {
		if (isDarkMode) document.body.style.backgroundColor = "#18181b";
		else document.body.style.backgroundColor = "#fff";
		return createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
	}, [isDarkMode]);

	useEffect(() => {
		changeStatusbarColor(isDarkMode);
	}, [isDarkMode]);

	return (
		<ThemeProvider theme={theme}>
			<DrawerProvider>
				<AccountMenuProvider>
					<AppBar />
					<div style={{ paddingTop: "64px", overflow: "auto" }}>
						<Routes>
							{routes.map((route) => (
								<Route
									key={route.path}
									path={route.path}
									element={route.element}
								/>
							))}
						</Routes>
					</div>
					<Connectivity />
					<CheckForUpdates />
					<ThemedToaster />
				</AccountMenuProvider>
			</DrawerProvider>
		</ThemeProvider>
	);
}

export default App;
