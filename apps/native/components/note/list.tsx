import React from "react";
import { FlatList, FlatListProps, ListRenderItemInfo } from "react-native";

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
  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<Note>) => {
    return <EnhancedNoteCard item={item} />;
  }, []);

  const emptyComponent = React.useCallback(() => {
    return <EmptyData message={emptyMessage} />;
  }, [emptyMessage]);

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingVertical: 12,
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
        gap: CARD_SEPERATION_GAP,
        flexGrow: 1
      }}
      ListEmptyComponent={emptyComponent}
      {...props}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}
