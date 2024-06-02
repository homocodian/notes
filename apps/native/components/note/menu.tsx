import React from "react";
import { IconButton, Menu as PaperMenu } from "react-native-paper";

export function Menu() {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
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
        onPress={() => {}}
        title="Copy"
      />
      <PaperMenu.Item leadingIcon="share" onPress={() => {}} title="Share" />
    </PaperMenu>
  );
}
