import React, { ComponentProps } from "react";
import { View } from "react-native";
import { Divider } from "react-native-paper";

import { Q } from "@nozbe/watermelondb";
import Fuse from "fuse.js";

import { SCREEN_VERTICAL_PADDING } from "@/constant/screens";
import { useLoading } from "@/context/loading";
import { useSearch } from "@/context/search";
import { useDebounce } from "@/hooks/use-debouce";
import { notes } from "@/lib/db/controllers/note";
import Note from "@/lib/db/model/note";

import { NoteList } from "../note/list";

interface ListProps
  extends Partial<Omit<ComponentProps<typeof NoteList>, "data">> {}

function List(props: ListProps) {
  const search = useSearch((state) => state.query);
  const [data, setData] = React.useState<Note[]>([]);
  const debouncedQuery = useDebounce(search, 500);
  const setLoading = useLoading((state) => state.setLoading);

  const searchQuery = React.useCallback(async (query: string) => {
    const words = query.toLowerCase().split(" ").filter(Boolean);

    // Create conditions for each word to check if the 'text'
    // column contains the word
    const textConditions = words.map((word) =>
      Q.where("text", Q.like(`%${Q.sanitizeLikeString(word)}%`))
    );

    const combinedTextConditions = Q.or(...textConditions);

    const finalCondition = Q.and(
      combinedTextConditions,
      Q.where("deleted_at", Q.eq(null))
    );

    const results = await notes.query(finalCondition).fetch();
    const fuse = new Fuse(results, {
      keys: ["category", "text"]
    });
    return fuse.search(query).map((result) => result.item);
  }, []);

  React.useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      searchQuery(debouncedQuery)
        .then(setData)
        .finally(() => setLoading(false));
    } else {
      if (data && data.length > 0) {
        setData([]);
      }
    }
  }, [debouncedQuery]);

  return (
    <>
      {data.length > 0 ? (
        <View style={{ paddingTop: SCREEN_VERTICAL_PADDING }}>
          <Divider />
        </View>
      ) : null}
      <NoteList data={data} emptyMessage="No results" {...props} />
    </>
  );
}

export const MemoizedList = React.memo(List);
