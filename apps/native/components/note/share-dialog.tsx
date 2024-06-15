import React from "react";
import { Keyboard } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";

import { z } from "zod";

import { useAuth } from "@/context/auth";
import { useBoolean } from "@/context/boolean";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { SharedNotesNoteController } from "@/lib/db/controllers/shared-with";
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
  const [isSaving, setIsSaving] = React.useState(false);

  const hideDialog = React.useCallback(() => {
    Keyboard.dismiss();
    setEmail("");
    setVisible(false);
  }, []);

  async function handleSubmit() {
    if (!email) return toast("Email is required.");
    setIsSaving(true);

    const emails = email.split(",").map((email) => email.trim());

    for (const email of emails) {
      const parsedEmail = emailSchema.safeParse(email);

      if (!parsedEmail.success) {
        toast(`Invalid email address '${email}'`);
        setIsSaving(false);
        return;
      }

      if (parsedEmail.data === user?.email) {
        toast("You can't share it yourself");
        setIsSaving(false);
        return;
      }
    }

    try {
      const data = await SharedNotesNoteController.save({
        noteId,
        userEmails: emails
      });

      data.emailsAlreadySharedWith.forEach((email) => {
        toast(`Note already shared with ${email}`);
      });
    } catch (error) {
      toast("Failed to share note");
    }
    setEmail("");
    setIsSaving(false);
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
          />
          <Text className="mt-2" style={{ color: theme.colors.secondary }}>
            Use comma for multiple emails
          </Text>
        </Dialog.Content>
        <Dialog.Actions className="flex flex-row justify-between items-center">
          <Button onPress={hideDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={isSaving} loading={isSaving}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
