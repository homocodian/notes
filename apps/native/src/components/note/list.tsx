import React, { useState } from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";

import { useHeaderHeight } from "@react-navigation/elements";
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo
} from "@shopify/flash-list";

import { LIST_PADDING_BOTTOM } from "@/constant/screens";
import { useAppTheme } from "@/context/material-3-theme-provider";
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
  const theme = useAppTheme();
  const height = useWindowDimensions().height;
  const headerHeight = useHeaderHeight();
  const [loading, setLoading] = useState(true);

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
    return <Divider />;
  }, []);

  return (
    <View className="flex-1 relative">
      <FlashList
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: LIST_PADDING_BOTTOM,
          ...contentContainerStyle
        }}
        ListEmptyComponent={emptyComponent}
        estimatedItemSize={20}
        {...props}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={SeperatorComponent}
        onLoad={() => setLoading(false)}
      />
      {loading ? (
        <View
          className="absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center"
          style={{ backgroundColor: theme.colors.background }}
        >
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
}
