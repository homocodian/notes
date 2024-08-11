import { useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { useUserStore } from "@/lib/store/user";
import { toast } from "@/lib/toast";

export default function OTP() {
  const theme = useAppTheme();
  const { verifyEmail, user } = useAuth();
  const [otp, setOtp] = useState("");
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const setIsSignUp = useUserStore((state) => state.setIsSignUp);

  const chunkSize = useMemo(
    () => width / 8 - SCREEN_HORIZONTAL_PADDING,
    [width]
  );

  async function submitOtp() {
    if (otp.length < 8) {
      toast("Please enter a valid code");
      return;
    }

    setIsLoading(true);
    await verifyEmail(otp);
    setIsLoading(false);
  }

  return (
    <SafeAreaView className="flex-1">
      <View
        className="space-y-8 mt-12"
        style={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingVertical: SCREEN_VERTICAL_PADDING
        }}
      >
        <View className="space-y-2">
          <Text variant="headlineLarge" className="font-bold text-center">
            OTP Verification
          </Text>
          <Text variant="bodyLarge" className="text-center">
            Enter OTP sent to {user?.email}
          </Text>
        </View>
        <View style={{ marginVertical: SCREEN_VERTICAL_PADDING }}>
          <OTPTextInput
            handleTextChange={setOtp}
            inputCount={8}
            tintColor={theme.colors.primary}
            containerStyle={{
              paddingHorizontal: SCREEN_HORIZONTAL_PADDING
            }}
            defaultValue={otp}
            textInputStyle={{
              // @ts-ignore TRUST ME, IT WORKS
              color: theme.colors.onBackground,
              margin: 0,
              width: chunkSize
            }}
          />
        </View>
        <View className="flex justify-center items-center">
          <Button
            mode="contained"
            className="px-4"
            disabled={isLoading}
            loading={isLoading}
            onPress={submitOtp}
          >
            Verify
          </Button>
        </View>
      </View>
      <Button
        mode="contained-tonal"
        className="absolute bottom-4 right-2"
        onPress={() => setIsSignUp(false)}
        disabled={isLoading}
      >
        Skip
      </Button>
    </SafeAreaView>
  );
}
