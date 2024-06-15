import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";

import { Model, Query } from "@nozbe/watermelondb";

import { useSharedBottomSheetStore } from "@/context/note/shared/bottom-sheet";

import { SharedWithBottomSheet } from "./bottom-sheet";
import { EnhancedBottomSheetFlatList } from "./botttom-sheet-flatlist";

export function SharedNoteSheet({ sharedWith }: { sharedWith: Query<Model> }) {
  const visible = useSharedBottomSheetStore(
    (state) => state.isSharedBottomSheetVisible
  );

  const setIsSharedBottomSheetVisible = useSharedBottomSheetStore(
    (state) => state.setIsSharedBottomSheetVisible
  );

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <GestureHandlerRootView>
        <SharedWithBottomSheet setVisible={setIsSharedBottomSheetVisible}>
          <EnhancedBottomSheetFlatList sharedWith={sharedWith} />
        </SharedWithBottomSheet>
      </GestureHandlerRootView>
    </Portal>
  );
}
