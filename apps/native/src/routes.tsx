import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HeaderNavButton } from "./components/header-nav-button";
import { useAuth } from "./context/auth";
import { Auth } from "./screens/auth";
import Devices from "./screens/devices";
import Root from "./screens/drawer/root";
import EditProfile from "./screens/edit-profile";
import NoteEditor from "./screens/note/editor";
import OTP from "./screens/otp";
import Search from "./screens/search";
import Settings from "./screens/settings";
import SignIn from "./screens/sign-in";
import SignUp from "./screens/sign-up";
import { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  const { user, isSignUp } = useAuth();
  return (
    <Stack.Navigator>
      {user && !isSignUp ? (
        <Stack.Group screenOptions={{ headerShadowVisible: false }}>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Devices" component={Devices} />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Editor"
            component={NoteEditor}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Group>
      ) : (
        <Stack.Group
          screenOptions={{
            headerShadowVisible: false,
            animationTypeForReplace: "push",
            animation: "slide_from_right"
          }}
        >
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{
              headerShown: false
            }}
            initialParams={{ to: "SignIn" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              title: "",
              headerStyle: { backgroundColor: "transparent" },
              headerRight: () => (
                <HeaderNavButton label="Sign up" screen="SignUp" />
              )
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              title: "",
              headerStyle: { backgroundColor: "transparent" },
              headerRight: () => (
                <HeaderNavButton label="Sign in" screen="SignIn" />
              )
            }}
          />
          <Stack.Screen
            name="OTP"
            component={OTP}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
