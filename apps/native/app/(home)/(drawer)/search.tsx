import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MemoizedList } from "@/components/search/list";
import { MemoizedSearchbar } from "@/components/search/searchbar";
import { LoadingProvider } from "@/context/loading";
import { SearchProvider } from "@/context/search";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 5,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }}
      className="flex-1"
    >
      <SearchProvider>
        <LoadingProvider>
          <MemoizedSearchbar />
          <MemoizedList
            contentContainerStyle={{
              paddingVertical: 12,
              paddingBottom: 0
            }}
          />
        </LoadingProvider>
      </SearchProvider>
    </View>
  );
}
