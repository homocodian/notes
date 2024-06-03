import React from "react";
import { View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

import { useAppTheme } from "@/context/material-3-theme-provider";
import Note from "@/lib/db/model/note";

import { Menu } from "./menu";

type NoteCardProps = { item: Note };

export function NoteCard({ item }: NoteCardProps) {
  const theme = useAppTheme();

  return (
    <Card>
      <Card.Content className="space-y-4 pt-1">
        <View className="flex flex-row justify-between items-center">
          <View>
            <Chip
              textStyle={{
                textTransform: "capitalize"
              }}
            >
              {item.category}
            </Chip>
          </View>
          <View>
            <Menu id={item.id} text={item.text} />
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
