import React from "react";
import { ListRenderItemInfo, View } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";

import { API } from "@/lib/api";

import { EmptyData } from "../empty";
import { MemoziedSharedWithSheetListView } from "./shared-with-sheet-list-view";

export type SharedData = { noteId: string; email: string };

export function BottomSheetList({ noteId }: { noteId: string }) {
  const { data, isFetching } = useQuery({
    queryKey: ["shared-with", noteId],
    queryFn: ({ signal }) =>
      API.get<SharedData[]>(`/v1/notes/${noteId}/share`, {
        options: {
          signal
        }
      }),
    initialData: [],
    refetchOnWindowFocus: false
  });

  const renderSeperator = React.useCallback(() => <Divider />, []);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<SharedData>) => (
      <MemoziedSharedWithSheetListView
        email={item.email}
        noteId={item.noteId}
      />
    ),
    [noteId]
  );

  const renderEmptyComponent = React.useCallback(
    () => (
      <EmptyData message="Not shared with anyone yet">
        <View className="p-4">
          <ActivityIndicator animating={isFetching} />
        </View>
      </EmptyData>
    ),
    [isFetching]
  );

  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={(i) => i.email}
      renderItem={renderItem}
      contentContainerStyle={{
        flexGrow: 1,
        minHeight: 200
      }}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeperator}
    />
  );
}
