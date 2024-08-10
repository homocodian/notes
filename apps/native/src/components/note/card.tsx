import React from "react";
import { View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

import { withObservables } from "@nozbe/watermelondb/react";

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
        <Card>
          <Card.Content className="space-y-4 pt-1">
            <View className="flex flex-row justify-between items-center">
              <View>
                <Chip
                  textStyle={{
                    textTransform: "capitalize"
                  }}
                  compact
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
                textDecorationLine: item.isComplete ? "line-through" : undefined
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
          </Card.Content>
        </Card>
        <ShareDialog noteId={item.id} />
      </BoolValueProvider>
      <SharedNoteSheet noteId={item.id} />
    </SharedNoteBottomSheetStoreProvider>
  );
}

export const EnhancedNoteCard = withObservables(["item"], ({ item }) => ({
  item
}))(NoteCard);
