import { useMemo } from "react";

import loadable from "@loadable/component";
import { Routes, Route } from "react-router-dom";
import { useTernaryDarkMode } from "usehooks-ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AppBar from "@/components/AppBar";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import PrivateRoute from "@/components/PrivateRoute";
import DrawerProvider from "@/context/DrawerContext";
import { getDesignTokens } from "@/utils/getDesignToken";
import Connectivity from "@/components/general/Connectivity";
import AccountMenuProvider from "@/context/AccountMenuContext";
import NotesCategoryProvider from "@/context/NotesCategoryProvider";
import { changeStatusbarColor } from "@/utils/change-statusbar-color";

const HomePage = loadable(() => import("@/pages/Home"));
const SignInPage = loadable(() => import("@/pages/SignIn"));
const SignUpPage = loadable(() => import("@/pages/SignUp"));

function App() {
	// get theme value from local storage
	const { isDarkMode } = useTernaryDarkMode();

	const theme = useMemo(() => {
		if (isDarkMode) document.body.style.backgroundColor = "#18181b";
		else document.body.style.backgroundColor = "#fff";
		return createTheme(getDesignTokens(isDarkMode ? "dark" : "light"));
	}, [isDarkMode]);

	changeStatusbarColor(isDarkMode);

	return (
		<ThemeProvider theme={theme}>
			<DrawerProvider>
				<AccountMenuProvider>
					<AppBar />
					<Routes>
						<Route path="*" element={<NotFound />} />
						<Route
							path="/"
							element={
								<PrivateRoute>
									<NotesCategoryProvider>
										<HomePage fallback={<Loading />} />
									</NotesCategoryProvider>
								</PrivateRoute>
							}
						/>
						<Route
							path="/signup"
							element={<SignUpPage fallback={<Loading />} />}
						/>
						<Route
							path="/login"
							element={<SignInPage fallback={<Loading />} />}
						/>
					</Routes>
					<Connectivity />
				</AccountMenuProvider>
			</DrawerProvider>
		</ThemeProvider>
	);
}

export default App;
