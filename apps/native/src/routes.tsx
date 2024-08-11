import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "./context/auth";
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
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OTP" component={OTP} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
