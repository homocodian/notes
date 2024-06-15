import React from "react";
import { Divider } from "react-native-paper";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { withObservables } from "@nozbe/watermelondb/react";

import { SharedWithNote } from "@/lib/db/model/shared-with";

import { EmptyData } from "../empty";
import { MemoziedSharedWithSheetListView } from "./shared-with-sheet-list-view";

function BottomSheetFlatListWrapper({ data }: { data: SharedWithNote[] }) {
  const renderSeperator = React.useCallback(() => <Divider />, []);

  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={(props) => <MemoziedSharedWithSheetListView {...props} />}
      contentContainerStyle={{
        flexGrow: 1,
        minHeight: 200
      }}
      ListEmptyComponent={<EmptyData message="Not shared with anyone yet" />}
      ItemSeparatorComponent={renderSeperator}
    />
  );
}

export const EnhancedBottomSheetFlatList = withObservables(
  ["sharedWith"],
  ({ sharedWith }) => ({
    data: sharedWith.observe()
  })
)(BottomSheetFlatListWrapper);
