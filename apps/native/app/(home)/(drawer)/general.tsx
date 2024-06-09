import React from "react";
import { View } from "react-native";

import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";

import { NoteList } from "@/components/note/list";
import { useAuth } from "@/context/auth";
import { notes } from "@/lib/db/controllers/note";

export default function GeneralNotesScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1">
      <EnhancedNoteList userId={user?.id} />
    </View>
  );
}

const EnhancedNoteList = withObservables(
  ["userId"],
  ({ userId }: { userId: number }) => {
    return {
      data: notes
        .query(
          Q.where("_deleted", Q.eq(false)),
          Q.where("user_id", Q.eq(userId)),
          Q.where("category", Q.eq("general")),
          Q.sortBy("updated_at", Q.desc)
        )
        .observe()
    };
  }
)(NoteList);
