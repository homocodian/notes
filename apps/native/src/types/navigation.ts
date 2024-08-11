import type { DrawerScreenProps } from "@react-navigation/drawer";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams
} from "@react-navigation/native";

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootDrawerParamsList>;
  Settings: undefined;
  Editor:
    | {
        noteId?: string;
        category?: string | null;
        text?: string;
      }
    | undefined;
  EditProfile: { to: "Name" | "Password" } | undefined;
  SignIn: undefined;
  SignUp: undefined;
  Devices: undefined;
  Search: undefined;
  OTP: undefined;
};

export type RootDrawerParamsList = {
  Home: undefined;
  General: undefined;
  Important: undefined;
  Shared: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type StackNavigation = NavigationProp<RootStackParamList>;

export type RootDrawerScreenProps<T extends keyof RootDrawerParamsList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamsList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
