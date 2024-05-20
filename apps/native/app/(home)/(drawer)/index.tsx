import React from "react";
import { FlatList, View } from "react-native";

import { NoteCard } from "@/components/note/card";
import {
  CARD_SEPERATION_GAP,
  SCREEN_HORIZONTAL_PADDING
} from "@/constant/screens";
import { Note } from "@/types/note";

const notes: Note[] = [
  {
    id: 1,
    text: "Hello lorem text",
    category: "general",
    isComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 1,
    email: "something@mail.com"
  },
  {
    id: 2,
    text: "Hello lorem text 2",
    category: "general",
    isComplete: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 2,
    email: "something@mail.com"
  }
];

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <FlatList
        data={notes}
        renderItem={({ item }) => <NoteCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          gap: CARD_SEPERATION_GAP
        }}
      />
    </View>
  );
}
