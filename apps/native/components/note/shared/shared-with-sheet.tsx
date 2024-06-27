import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";

import { useSharedBottomSheetStore } from "@/context/note/shared/bottom-sheet";

import { SharedWithBottomSheet } from "./bottom-sheet";
import { BottomSheetList } from "./botttom-sheet-list";

export function SharedNoteSheet({ noteId }: { noteId: string }) {
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
          <BottomSheetList noteId={noteId} />
        </SharedWithBottomSheet>
      </GestureHandlerRootView>
    </Portal>
  );
}
