import { useEffect, useState } from "react";

import EmptyNote from "@/components/EmptyNote";
import { NoteCard } from "@/components/main";
import NoteSkeleton from "@/components/NoteSkeleton";
import { axiosInstance } from "@/lib/axios";
import { Note } from "@/types/notes";
import { Masonry } from "@mui/lab";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

async function fetchImportantNotes() {
  const searchParams = new URLSearchParams();
  searchParams.set("field", "category");
  searchParams.set("q", "important");
  const res = await axiosInstance.get(`/notes?${searchParams.toString()}`);
  return res.data;
}

function Important() {
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: ["notes", "important"],
    queryFn: fetchImportantNotes,
  });
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);
  const [searchParams] = useSearchParams();

  const searchString = searchParams.get("q");

  useEffect(() => {
    const query = searchParams.get("q");

    if (!query || !data) {
      return;
    }

    setSearchedNotes(
      data.filter((item) => {
        if (
          item.text.toLocaleLowerCase().includes(query?.toLocaleLowerCase())
        ) {
          return item;
        }
      }),
    );
  }, [searchParams, data]);

  return (
    <>
      {isLoading ? (
        <NoteSkeleton />
      ) : !data ||
        data.length <= 0 ||
        (searchedNotes.length <= 0 && searchString) ? (
        <EmptyNote />
      ) : (
        <div className="flex justify-center items-center">
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {(searchedNotes.length > 0 && searchParams.get("q")
              ? searchedNotes
              : data
            ).map((note) => {
              return (
                <NoteCard
                {...note}
                  key={note.id}
                />
              );
            })}
          </Masonry>
        </div>
      )}
    </>
  );
}

export default Important;
