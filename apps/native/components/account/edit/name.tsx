import { useState } from "react";
import { Keyboard, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput
} from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Colors } from "@/constant/colors";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { useUserStore } from "@/lib/store/user";
import { toast } from "@/lib/toast";
import { userSchema } from "@/lib/validations/user";

export function EditAccountName() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const data = await API.patch("/v1/users/profile", {
        data: { displayName: displayName.trim() }
      });
      const user = userSchema.omit({ sessionToken: true }).parse(data);
      setUser((data: any) => {
        if (!data) return data;
        return { ...data, ...user };
      });
      toast("Display name updated");
      router.dismiss();
    } catch (error) {
      toast(error instanceof APIError ? error.message : "Failed to update");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return <Text>Unauthorized</Text>;
  }

  return (
    <View className="flex flex-col gap-4">
      <Text variant="labelLarge" style={{ color: Colors.muted }}>
        Display Name
      </Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        mode="outlined"
        placeholder="Display Name"
        right={
          <TextInput.Icon
            icon={(props) => <Ionicons name="close-circle" {...props} />}
            onPress={() => setDisplayName("")}
          />
        }
      />
      <Button
        mode="contained"
        disabled={
          displayName.trim() === user.displayName || !displayName.trim()
        }
        onPress={handleSave}
      >
        Save Changes
      </Button>
      <Portal>
        <Dialog visible={isLoading} dismissable={false}>
          <Dialog.Content>
            <View className="flex flex-row items-center space-x-4">
              <ActivityIndicator animating />
              <Text>Saving...</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}
