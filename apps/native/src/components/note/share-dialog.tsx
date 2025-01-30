import React from "react";
import { Keyboard } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useAuth } from "@/context/auth";
import { useBoolean } from "@/context/boolean";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { API } from "@/lib/api";
import { APIError } from "@/lib/api-error";
import { toast } from "@/lib/toast";

type ShareDialogProps = {
  noteId: string;
};

const emailSchema = z.string().email();

export function ShareDialog({ noteId }: ShareDialogProps) {
  const { user } = useAuth();
  const theme = useAppTheme();
  const [email, setEmail] = React.useState("");
  const visible = useBoolean((state) => state.boolValue);
  const setVisible = useBoolean((state) => state.setBoolValue);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["share-to"],
    mutationFn: (emails: string[]) =>
      API.post(`/v1/notes/${noteId}/share`, { data: emails })
  });

  const hideDialog = React.useCallback(() => {
    Keyboard.dismiss();
    setEmail("");
    setVisible(false);
  }, []);

  const cancelShare = React.useCallback(() => {
    hideDialog();
  }, [hideDialog]);

  async function handleSubmit() {
    if (!email) return toast("Email is required.");

    const emails = email.split(",").map((email) => email.trim());

    for (const email of emails) {
      const parsedEmail = emailSchema.safeParse(email);

      if (!parsedEmail.success) {
        toast(`Invalid email address '${email}'`);
        return;
      }

      if (parsedEmail.data === user?.email) {
        toast("You can't share it yourself");
        return;
      }
    }

    try {
      await mutateAsync(emails);
    } catch (error: any) {
      if (error instanceof APIError) toast(error.message);
      else toast("Failed to share note");
    }
    setEmail("");
    hideDialog();
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} dismissable={!email}>
        <Dialog.Title style={{ fontSize: 18 }}>
          Email(s) of the person(s) you want to share this note with
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
          <Text className="mt-2" style={{ color: theme.colors.secondary }}>
            Use comma for multiple emails
          </Text>
        </Dialog.Content>
        <Dialog.Actions className="flex flex-row justify-between items-center">
          <Button onPress={cancelShare}>Cancel</Button>
          <Button
            onPress={handleSubmit}
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
