import React from "react";
import { View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

import { useAppTheme } from "@/context/material-3-theme-provider";
import { Note } from "@/types/note";

import { Menu } from "./menu";

interface NoteCardProps extends Note {}

export function NoteCard({
  id,
  category,
  text,
  createdAt,
  isComplete
}: NoteCardProps) {
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
              {category}
            </Chip>
          </View>
          <View>
            <Menu id={id} text={text} />
          </View>
        </View>
        <Text
          style={{
            textDecorationLine: isComplete ? "line-through" : undefined
          }}
        >
          {text}
        </Text>
        <View>
          <Text style={{ color: theme.colors.onSurfaceDisabled }}>
            Date created {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
