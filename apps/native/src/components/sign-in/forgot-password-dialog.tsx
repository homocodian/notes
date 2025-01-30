import React from "react";
import { Keyboard } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

import { useAuth } from "@/context/auth";

import { Snackbar } from "../ui/use-snackbar";

export function ForgotPasswordDialog({
  visible,
  setVisible
}: {
  visible: boolean;
  setVisible: (prop: boolean) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const { sendPasswordResetEmail } = useAuth();

  async function handleForgotPassword() {
    Keyboard.dismiss();

    if (!email) {
      Snackbar({
        text: "Please type your email in the email field"
      });
      return;
    }

    setIsPending(true);

    const { error } = await sendPasswordResetEmail(email);

    if (error) {
      Snackbar({
        text: error
      });
    } else {
      Snackbar({
        text: "Reset link sent to your email, if not found please check your spam folder"
      });
    }

    setIsPending(false);
    setVisible(false);
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title style={{ fontSize: 18 }}>
          Send password reset link
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputMode="email"
            mode="outlined"
            label="Email"
            autoFocus
            disabled={isPending}
          />
        </Dialog.Content>
        <Dialog.Actions className="flex flex-row justify-between items-center">
          <Button onPress={() => setVisible(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onPress={handleForgotPassword}
            disabled={isPending}
            loading={isPending}
          >
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
