import React from "react";
import { FlatList, View } from "react-native";

import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";

import { EnhancedNoteCard } from "@/components/note/card";
import {
  CARD_SEPERATION_GAP,
  SCREEN_HORIZONTAL_PADDING
} from "@/constant/screens";
import { notes } from "@/lib/db/controllers/note";
import Note from "@/lib/db/model/note";

type HomeScreenProps = { notes: Note[] };

function HomeScreen({ notes }: HomeScreenProps) {
  return (
    <View className="flex-1">
      <FlatList
        data={notes}
        renderItem={({ item }) => <EnhancedNoteCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingVertical: 12,
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          gap: CARD_SEPERATION_GAP
        }}
      />
    </View>
  );
}

const enhance = withObservables([], () => ({
  notes: notes.query(Q.sortBy("updated_at", Q.desc)).observe()
}));

export default enhance(HomeScreen);
