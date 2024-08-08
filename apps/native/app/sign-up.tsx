import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Keyboard, ScrollView, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RegisterAuthSchema } from "@/lib/validations/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";

import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { registerAuthSchema } from "@/lib/validations/auth";

function Register() {
  const theme = useAppTheme();
  const { createUser, user } = useAuth();
  const [isSecureEntry, setIsSecureEntry] = React.useState(true);
  const [isSecureEntryForConfirm, setIsSecureEntryForConfirm] =
    React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

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

  async function onSubmit(data: RegisterAuthSchema) {
    Keyboard.dismiss();
    setIsLoading(true);
    await createUser(data).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          gap: 20
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex justify-center items-center gap-3 px-5">
          <Image
            source={require("@/assets/images/icon_light.png")}
            style={{
              width: 50,
              height: 50,
              tintColor: theme.colors.primary
            }}
          />
          <View className="flex gap-1">
            <Text className="text-center text-2xl font-bold">Cinememo</Text>
            <Text variant="labelLarge" className="text-center">
              Create your account
            </Text>
          </View>
        </View>
        <View className="flex justify-between items-center  self-stretch px-5">
          <View className="self-stretch">
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
            <HelperText type="error" visible={!!errors.fullName}>
              {errors.fullName?.message}
            </HelperText>
          </View>
          <View className="self-stretch">
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
            <HelperText type="error" visible={!!errors.email}>
              {errors.email?.message}
            </HelperText>
          </View>
          <View className="self-stretch">
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
            <HelperText type="error" visible={!!errors.password}>
              {errors.password?.message}
            </HelperText>
          </View>
          <View className="self-stretch">
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
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword?.message}
            </HelperText>
          </View>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            className="self-stretch mt-1"
            loading={isLoading}
            disabled={isLoading}
          >
            SIGN UP
          </Button>
        </View>
        {/* terms */}
        <Text className="text-center px-5">
          By singing in you accept our{" "}
          <Link href="https://notes-ashish.netlify.app/">
            <Text className="text-blue-500 ml-2 underline">Terms of use</Text>
          </Link>{" "}
          and{" "}
          <Link href="https://notes-ashish.netlify.app/">
            <Text className="text-blue-500 ml-2 underline">Privary policy</Text>
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Register;
