import React from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";

import { withObservables } from "@nozbe/watermelondb/react";

import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { BoolValueProvider } from "@/context/boolean";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { SharedNoteBottomSheetStoreProvider } from "@/context/note/shared/bottom-sheet";
import Note from "@/lib/db/model/note";

import { Menu } from "./menu";
import { ShareDialog } from "./share-dialog";
import { SharedNoteSheet } from "./shared/shared-with-sheet";

type NoteCardProps = { item: Note };

function NoteCard({ item }: NoteCardProps) {
  const theme = useAppTheme();
  const { user } = useAuth();

  const isOwner = item.userId === user?.id;

  return (
    <SharedNoteBottomSheetStoreProvider>
      <BoolValueProvider>
        <View
          style={{
            paddingLeft: SCREEN_HORIZONTAL_PADDING,
            paddingBottom: SCREEN_VERTICAL_PADDING
          }}
        >
          <View className="space-y-4 pt-1">
            <View className="flex flex-row justify-between items-center">
              <View>
                <Chip
                  textStyle={{
                    textTransform: "capitalize"
                  }}
                  compact
                  style={{
                    borderRadius: 9999
                  }}
                >
                  {!isOwner ? "Shared" : item.category}
                </Chip>
              </View>
              <View>
                <Menu
                  id={item.id}
                  text={item.text}
                  category={item.category}
                  isComplete={item.isComplete}
                  userId={item.userId}
                />
              </View>
            </View>
            <Text
              style={{
                textDecorationLine: item.isComplete
                  ? "line-through"
                  : undefined,
                paddingRight: SCREEN_HORIZONTAL_PADDING
              }}
              variant="bodyLarge"
            >
              {item.text}
            </Text>
            <View>
              <Text style={{ color: theme.colors.onSurfaceDisabled }}>
                Date created {item.createdAt.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <ShareDialog noteId={item.id} />
      </BoolValueProvider>
      <SharedNoteSheet noteId={item.id} />
    </SharedNoteBottomSheetStoreProvider>
  );
}

export const EnhancedNoteCard = withObservables(["item"], ({ item }) => ({
  item
}))(NoteCard);
