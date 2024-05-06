import { Masonry } from "@mui/lab";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import EmptyNote from "@/components/EmptyNote";
import NoteSkeleton from "@/components/NoteSkeleton";
import { NoteCard } from "@/components/main";
import { APIError } from "@/lib/api-error";
import { api } from "@/lib/eden";
import { Note } from "@/types/notes";

async function fetchSharedNotes() {
  const { error, data } = await api.v1.notes.shared.get();

  if (error) {
    throw new APIError(error.value, error.status);
  }

  return data;
}

function Shared() {
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: ["notes", "shared"],
    queryFn: fetchSharedNotes
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
      })
    );
  }, [searchParams, data]);

  return (
    <>
      {isLoading ? (
        <NoteSkeleton />
      ) : !data ||
        data.length <= 0 ||
        (searchedNotes.length <= 0 && searchString) ? (
        <EmptyNote message="Notes shared to you will appear here" />
      ) : (
        <div className="flex justify-center items-center">
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {(searchedNotes.length > 0 && searchString
              ? searchedNotes
              : data
            ).map((note) => {
              return <NoteCard {...note} key={note.id} />;
            })}
          </Masonry>
        </div>
      )}
    </>
  );
}

export default Shared;
