import { useState } from "react";
import { Image, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { FontAwesome6, Ionicons } from "@expo/vector-icons";

import { ExternalLink } from "@/components/external-link";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { toast } from "@/lib/toast";
import { RootStackScreenProps } from "@/types/navigation";

export function Auth({ route, navigation }: RootStackScreenProps<"Auth">) {
  const theme = useAppTheme();
  const { googleSignIn } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    const { error } = await googleSignIn();

    if (error) {
      toast(error);
    }

    setIsGoogleLoading(false);
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
        paddingVertical: SCREEN_VERTICAL_PADDING
      }}
    >
      <View className="flex-1 justify-center items-center">
        {/* nativewind's gap is not working as expected */}
        <View className="w-full" style={{ gap: 20 }}>
          <View className="justify-center items-center">
            <Image
              source={require("./../../assets/images/icon_light.png")}
              style={{
                width: 50,
                height: 50,
                tintColor: theme.colors.primary
              }}
            />
          </View>
          <View className="mb-2">
            <Text variant="headlineMedium" className="text-center font-bold">
              {route.params.to === "SignIn"
                ? "Login in to Cinememo"
                : "Sign up for Cinememo"}
            </Text>
          </View>
          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            loading={isGoogleLoading}
            disabled={isGoogleLoading}
            icon={(props) => <FontAwesome6 name="google" {...props} />}
          >
            Continue with Google
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              navigation.push(route.params.to);
            }}
            icon={(props) => <Ionicons name="mail-outline" {...props} />}
          >
            Continue with email
          </Button>
        </View>
      </View>

      <View>
        <Text className="text-center">
          By continuing, you accept our{" "}
          <ExternalLink href="https://notes-ashish.netlify.app/terms">
            <Text className="text-blue-500 ml-2 underline">Terms of use</Text>
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href="https://notes-ashish.netlify.app/privacy">
            <Text className="text-blue-500 ml-2 underline">Privary policy</Text>
          </ExternalLink>
        </Text>
      </View>
      <View className="my-4">
        <Divider />
      </View>
      <View className="flex flex-row justify-center items-center gap-x-2">
        {route.params.to !== "SignIn" ? (
          <>
            <Text>Already have an account?</Text>
            <Button
              onPress={() => {
                navigation.replace("Auth", {
                  to: route.params.to === "SignIn" ? "SignUp" : "SignIn"
                });
              }}
              style={{ backgroundColor: theme.colors.elevation.level1 }}
            >
              Sign in
            </Button>
          </>
        ) : (
          <>
            <Text>Don't have an account?</Text>
            <Button
              onPress={() => {
                navigation.replace("Auth", {
                  to: route.params.to === "SignIn" ? "SignUp" : "SignIn"
                });
              }}
              style={{ backgroundColor: theme.colors.elevation.level1 }}
            >
              Sign up
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
