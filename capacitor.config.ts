import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.notes.homocodians",
	appName: "Notes",
	webDir: "dist",
	bundledWebRuntime: false,
	plugins: {
		SplashScreen: {
			launchAutoHide: true,
			launchShowDuration: 0,
		},
		GoogleAuth: {
			scopes: ["profile", "email"],
			serverClientId: "xxxxxx-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
			forceCodeForRefreshToken: true,
		},
	},
};

export default config;
