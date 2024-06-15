import React from "react";
import { ListRenderItemInfo, View } from "react-native";
import { IconButton, Text, Tooltip } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "@/context/material-3-theme-provider";
import { SharedNotesNoteController } from "@/lib/db/controllers/shared-with";
import { SharedWithNote } from "@/lib/db/model/shared-with";
import { toast } from "@/lib/toast";

function SharedWithSheetListView({ item }: ListRenderItemInfo<SharedWithNote>) {
  const theme = useAppTheme();

  return (
    <View key={item.id} className="px-4 py-1 flex flex-row items-center">
      <Tooltip title="pending">
        <MaterialCommunityIcons
          name="clock-outline"
          size={16}
          color={theme.colors.secondary}
          style={{ marginRight: 10 }}
        />
      </Tooltip>
      <Text className="flex-1">{item.userEmail}</Text>
      <Tooltip title="Remove from shared">
        <IconButton
          icon="close"
          onPress={async () => {
            try {
              await SharedNotesNoteController.delete(item.id);
              toast("Removed from shared");
            } catch (error) {
              toast("Failed to removed from shared");
            }
          }}
        />
      </Tooltip>
    </View>
  );
}

export const MemoziedSharedWithSheetListView = React.memo(
  SharedWithSheetListView
);
