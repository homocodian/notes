import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

import type { RegisterAuthSchema } from "@/lib/validations/auth";

import { zodResolver } from "@hookform/resolvers/zod";

import { SCREEN_HORIZONTAL_PADDING } from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { toast } from "@/lib/toast";
import { registerAuthSchema } from "@/lib/validations/auth";
import { RootStackScreenProps } from "@/types/navigation";

function SignUp({ navigation }: RootStackScreenProps<"SignUp">) {
  const { createUser } = useAuth();
  const [isSecureEntry, setIsSecureEntry] = React.useState(true);
  const [isSecureEntryForConfirm, setIsSecureEntryForConfirm] =
    React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterAuthSchema>({
    resolver: zodResolver(registerAuthSchema),
    defaultValues: {
      fullName: undefined,
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  function handleEyePress() {
    setIsSecureEntry((prev) => !prev);
  }

  function handleEyePressOfConfirm() {
    setIsSecureEntryForConfirm((prev) => !prev);
  }

  function onSubmit(data: RegisterAuthSchema) {
    Keyboard.dismiss();
    setIsLoading(true);
    createUser(data)
      .then(() => {
        toast("Please verify your email.");
        navigation.navigate("OTP");
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING
      }}
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          gap: 20
        }}
      >
        <Text variant="titleLarge" className="text-center font-bold">
          Create an account
        </Text>
        <View style={{ display: "flex", gap: 15, flex: 1 }}>
          <View>
            <Controller
              control={control}
              rules={{
                required: false
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  mode="outlined"
                  label="Full Name"
                  className="w-full"
                  autoComplete="name"
                />
              )}
              name="fullName"
            />
            {errors.fullName?.message ? (
              <HelperText type="error" visible>
                {errors.fullName?.message}
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
                  label="Confirm Password"
                  className="w-full"
                  secureTextEntry={isSecureEntryForConfirm}
                  autoCapitalize="none"
                  right={
                    isSecureEntryForConfirm ? (
                      <TextInput.Icon
                        icon="eye"
                        onPress={handleEyePressOfConfirm}
                      />
                    ) : (
                      <TextInput.Icon
                        icon="eye-off"
                        onPress={handleEyePressOfConfirm}
                      />
                    )
                  }
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword?.message ? (
              <HelperText type="error" visible>
                {errors.confirmPassword?.message}
              </HelperText>
            ) : null}
          </View>
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          className="mb-3"
          loading={isLoading}
          disabled={isLoading}
        >
          SIGN UP
        </Button>
      </View>
    </View>
  );
}

export default SignUp;
