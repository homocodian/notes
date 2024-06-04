import React from "react";
import { IconButton, Menu as PaperMenu } from "react-native-paper";

import { router } from "expo-router";

import { copyString } from "@/lib/copy";
import { NotesController } from "@/lib/db/controllers/note";
import { useNoteFormStore } from "@/lib/store/note";
import { toast } from "@/lib/toast";

type MenuProps = {
  id: string;
  text: string;
  category: string;
  isComplete: boolean;
  disable?: boolean;
};

export function Menu({
  id,
  text,
  category,
  isComplete,
  disable = false
}: MenuProps) {
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

  async function deleteById() {
    await NotesController.destroy(id);
  }

  return (
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
      <PaperMenu.Item
        leadingIcon="delete"
        onPress={handleClick(deleteById)}
        title="Delete"
      />
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
      <PaperMenu.Item leadingIcon="share" onPress={() => {}} title="Share" />
    </PaperMenu>
  );
}
