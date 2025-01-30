import React from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Text,
  Tooltip
} from "react-native-paper";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API } from "@/lib/api";
import { toast } from "@/lib/toast";

function SharedWithSheetListView(item: { email: string; noteId: string }) {
  const queryClient = useQueryClient();
  const isRefreshingSharedWith = queryClient.isFetching({
    queryKey: ["shared-with", item.noteId]
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["shared-with", item.noteId],
    mutationFn: async (email: string) =>
      await API.patch(`/v1/notes/${item.noteId}/share`, {
        data: email
      }),
    onSuccess: () => toast("Removed from shared"),
    onError: () => toast("Failed to removed from shared"),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["shared-with", item.noteId],
        exact: true
      });
    }
  });

  return (
    <View key={item.email} className="px-4 py-1 flex flex-row items-center">
      <Text className="flex-1">{item.email}</Text>
      {isPending ? (
        <IconButton
          icon={({ color, size }) => (
            <ActivityIndicator
              style={{
                height: size,
                width: size
              }}
              color={color}
            />
          )}
          disabled
        />
      ) : (
        <Tooltip title="Remove">
          <IconButton
            icon="close"
            onPress={() => mutate(item.email)}
            disabled={!!isRefreshingSharedWith}
          />
        </Tooltip>
      )}
    </View>
  );
}

export const MemoziedSharedWithSheetListView = React.memo(
  SharedWithSheetListView
);
