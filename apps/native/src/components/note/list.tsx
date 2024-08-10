import React from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo
} from "@shopify/flash-list";

import {
  CARD_SEPERATION_GAP,
  LIST_PADDING_BOTTOM,
  SCREEN_HORIZONTAL_PADDING
} from "@/constant/screens";
import Note from "@/lib/db/model/note";

import { EnhancedNoteCard } from "./card";
import { EmptyData } from "./empty";

interface ListProps<T> extends Omit<FlashListProps<T>, "renderItem"> {
  emptyMessage?: string;
  contentContainerStyle?: ViewStyle;
}

export function NoteList<T extends Note>({
  emptyMessage,
  contentContainerStyle,
  ...props
}: ListProps<T>) {
  const height = useWindowDimensions().height;
  const headerHeight = useHeaderHeight();

  const renderItem = React.useCallback(({ item }: ListRenderItemInfo<Note>) => {
    return <EnhancedNoteCard item={item} />;
  }, []);

  const emptyComponent = React.useCallback(() => {
    return (
      <EmptyData
        message={emptyMessage}
        height={height - (headerHeight + LIST_PADDING_BOTTOM)}
      />
    );
  }, [emptyMessage, height, headerHeight]);

  const SeperatorComponent = React.useCallback(() => {
    return (
      <View
        style={{
          height: CARD_SEPERATION_GAP
        }}
      />
    );
  }, []);

  return (
    <FlashList
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingBottom: LIST_PADDING_BOTTOM,
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
        ...contentContainerStyle
      }}
      ListEmptyComponent={emptyComponent}
      estimatedItemSize={100}
      {...props}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={SeperatorComponent}
    />
  );
}
