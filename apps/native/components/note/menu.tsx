import React from "react";
import { IconButton, Menu as PaperMenu } from "react-native-paper";

import { copyString } from "@/lib/copy";
import { toast } from "@/lib/toast";

type MenuProps = {
  id: number;
  text: string;
};

export function Menu({ id, text }: MenuProps) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const copyText = async () => {
    const copied = await copyString(text);
    if (!copied) toast("Failed to copy.");
  };

  const handleClick = (cb: () => void) => () => {
    closeMenu();
    cb();
  };

  return (
    <PaperMenu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton onPress={openMenu} icon="dots-vertical" />}
      anchorPosition="bottom"
    >
      <PaperMenu.Item leadingIcon="check" onPress={() => {}} title="Done" />
      <PaperMenu.Item leadingIcon="delete" onPress={() => {}} title="Delete" />
      <PaperMenu.Item leadingIcon="pencil" onPress={() => {}} title="Edit" />
      <PaperMenu.Item
        leadingIcon="content-copy"
        onPress={handleClick(copyText)}
        title="Copy"
      />
      <PaperMenu.Item leadingIcon="share" onPress={() => {}} title="Share" />
    </PaperMenu>
  );
}
