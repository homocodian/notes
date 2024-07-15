import React from "react";
import { IconButton, Menu as PaperMenu } from "react-native-paper";

import * as Haptics from "expo-haptics";
import { router } from "expo-router";

import { useAuth } from "@/context/auth";
import { useBoolean } from "@/context/boolean";
import { useSharedBottomSheetStore } from "@/context/note/shared/bottom-sheet";
import { sync } from "@/hooks/use-sync";
import { copyString } from "@/lib/copy";
import { NotesController } from "@/lib/db/controllers/note";
import { useNoteFormStore } from "@/lib/store/note";
import { toast } from "@/lib/toast";

import { Snackbar } from "../ui/use-snackbar";

type MenuProps = {
  id: string;
  text: string;
  category: string;
  isComplete: boolean;
  disable?: boolean;
  userId: number;
};

type DeleteByIdProps = { failureMessage: string; successMessage: string };

export function Menu({
  id,
  text,
  category,
  isComplete,
  disable = false,
  userId
}: MenuProps) {
  const setIsSharedBottomSheetVisible = useSharedBottomSheetStore(
    (state) => state.setIsSharedBottomSheetVisible
  );
  const setIsShareDialogOpen = useBoolean((state) => state.setBoolValue);

  const { user, signOut } = useAuth();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const copyText = async () => {
    const copied = await copyString(text);
    if (!copied) toast("Failed to copy.");
  };

  const handleClick = (cb?: () => void) => () => {
    closeMenu();
    cb?.();
  };

  async function deleteById({
    successMessage,
    failureMessage
  }: DeleteByIdProps) {
    try {
      await NotesController.delete(id);
      Snackbar({
        text: successMessage,
        action: {
          label: "Undo",
          onPress: () => NotesController.undo(id)
        },
        onRemove: async () => {
          const note = await NotesController.find(id);
          if (note && note.deletedAt !== null) {
            sync(signOut);
          }
        }
      });
    } catch (error) {
      toast(failureMessage);
    }
  }

  return (
    <>
      <PaperMenu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            onPress={openMenu}
            icon="dots-vertical"
            disabled={disable}
          />
        }
        anchorPosition="bottom"
      >
        <PaperMenu.Item
          leadingIcon="check"
          onPress={handleClick(() =>
            NotesController.edit({ id, isComplete: !isComplete })
          )}
          title={isComplete ? "Undone" : "Done"}
        />
        {userId === user?.id ? (
          <PaperMenu.Item
            leadingIcon="delete"
            onPress={handleClick(() =>
              deleteById({
                successMessage: "Note Deleted",
                failureMessage: "Failed to delete note."
              })
            )}
            title="Delete"
          />
        ) : (
          <PaperMenu.Item
            leadingIcon="close"
            onPress={handleClick(() =>
              deleteById({
                successMessage: "Note Removed",
                failureMessage: "Failed to remove note."
              })
            )}
            title="Remove"
          />
        )}
        <PaperMenu.Item
          leadingIcon="pencil"
          onPress={handleClick(() => {
            useNoteFormStore.setState({ text, category });
            router.push(`/note/editor?edit=${id}`);
          })}
          title="Edit"
        />
        <PaperMenu.Item
          leadingIcon="content-copy"
          onPress={handleClick(copyText)}
          title="Copy"
        />
        <PaperMenu.Item
          leadingIcon="share"
          onPress={handleClick(() => setIsShareDialogOpen(true))}
          title="Share"
        />
        <PaperMenu.Item
          leadingIcon="account-group"
          onPress={handleClick(async () => {
            await Haptics.selectionAsync();
            setIsSharedBottomSheetVisible(true);
          })}
          title="Members"
        />
      </PaperMenu>
    </>
  );
}
