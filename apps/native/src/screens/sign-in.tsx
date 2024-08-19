import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

import type { AuthSchema } from "@/lib/validations/auth";

import { zodResolver } from "@hookform/resolvers/zod";

import { ForgotPasswordDialog } from "@/components/sign-in/forgot-password-dialog";
import { SCREEN_HORIZONTAL_PADDING } from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { authSchema } from "@/lib/validations/auth";

function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSecureEntry, setIsSecureEntry] = React.useState(true);
  const { signIn } = useAuth();
  const [visible, setVisible] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  function handleEyePress() {
    setIsSecureEntry((prev) => !prev);
  }

  async function onSubmit(data: AuthSchema) {
    Keyboard.dismiss();
    setIsLoading(true);
    await signIn(data.email, data.password);
    setIsLoading(false);
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING
        }}
      >
        <View style={{ display: "flex", gap: 15, flex: 1 }}>
          <Text className="text-center font-bold my-4" variant="titleLarge">
            Enter your sign in information
          </Text>
          <View>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  label="Email"
                  className="w-full"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
            {errors.email?.message ? (
              <HelperText type="error" visible>
                {errors.email?.message}
              </HelperText>
            ) : null}
          </View>
          <View>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  label="Password"
                  className="w-full"
                  secureTextEntry={isSecureEntry}
                  autoCapitalize="none"
                  right={
                    isSecureEntry ? (
                      <TextInput.Icon icon="eye" onPress={handleEyePress} />
                    ) : (
                      <TextInput.Icon icon="eye-off" onPress={handleEyePress} />
                    )
                  }
                />
              )}
              name="password"
            />
            {errors.password?.message ? (
              <HelperText type="error" visible>
                {errors.password?.message}
              </HelperText>
            ) : null}
          </View>
          <Button
            className="self-end"
            onPress={() => setVisible(true)}
            disabled={isLoading}
          >
            Forgot password?
          </Button>
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          className="mb-3"
          loading={isLoading}
          disabled={isLoading}
        >
          SIGN IN
        </Button>
      </View>
      <ForgotPasswordDialog visible={visible} setVisible={setVisible} />
    </>
  );
}

export default SignIn;
