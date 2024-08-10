import React from "react";
import { Searchbar as PaperSearchbar } from "react-native-paper";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useShallow } from "zustand/react/shallow";

import { SCREEN_HORIZONTAL_PADDING } from "@/constant/screens";
import { useLoading } from "@/context/loading";
import { useSearch } from "@/context/search";

function Searchbar() {
  const navigator = useNavigation();
  const [searchQuery, setSearchQuery] = useSearch(
    useShallow((state) => [state.query, state.setQuery])
  );
  const loading = useLoading((state) => state.loading);

  return (
    <PaperSearchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
      loading={loading}
      autoFocus
      autoCapitalize="none"
      icon={(props) => <MaterialIcons name="arrow-back" {...props} />}
      onIconPress={navigator.goBack}
      style={{ marginHorizontal: SCREEN_HORIZONTAL_PADDING }}
    />
  );
}

export const MemoizedSearchbar = React.memo(Searchbar);
