import React from "react";
import { View } from "react-native";

import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";

import { NoteList } from "@/components/note/list";
import { notes } from "@/lib/db/controllers/note";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <EnhancedNoteList />
    </View>
  );
}

const EnhancedNoteList = withObservables([], () => ({
  data: notes
    .query(Q.where("_deleted", Q.eq(false)), Q.sortBy("updated_at", Q.desc))
    .observe()
}))(NoteList);
