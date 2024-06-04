import React from "react";
import { View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

import { withObservables } from "@nozbe/watermelondb/react";

import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import Note from "@/lib/db/model/note";

import { Menu } from "./menu";

type NoteCardProps = { item: Note };

function NoteCard({ item }: NoteCardProps) {
  const theme = useAppTheme();
  const { user } = useAuth();

  const isOwner = item.userId === user?.id;

  return (
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
              disable={!user?.id || user.id !== item.userId}
            />
          </View>
        </View>
        <Text
          style={{
            textDecorationLine: item.isComplete ? "line-through" : undefined
          }}
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
  );
}

export const EnhancedNoteCard = withObservables(["item"], ({ item }) => ({
  item
}))(NoteCard);
