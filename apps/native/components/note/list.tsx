import { FlatList, FlatListProps } from "react-native";

import {
  CARD_SEPERATION_GAP,
  SCREEN_HORIZONTAL_PADDING
} from "@/constant/screens";
import Note from "@/lib/db/model/note";

import { EnhancedNoteCard } from "./card";
import { EmptyData } from "./empty";

interface ListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  emptyMessage?: string;
}

export function NoteList<T extends Note>({
  emptyMessage,
  ...props
}: ListProps<T>) {
  return (
    <FlatList
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingVertical: 12,
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
        gap: CARD_SEPERATION_GAP,
        flexGrow: 1
      }}
      ListEmptyComponent={<EmptyData message={emptyMessage} />}
      {...props}
      renderItem={({ item }) => <EnhancedNoteCard item={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
