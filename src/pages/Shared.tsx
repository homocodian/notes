import { useEffect, useState } from "react";

import EmptyNote from "@/components/EmptyNote";
import { NoteCard } from "@/components/main";
import NoteSkeleton from "@/components/NoteSkeleton";
import { axiosInstance } from "@/lib/axios";
import { Note } from "@/types/notes";
import { Masonry } from "@mui/lab";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

async function fetchSharedNotes() {
  const searchParams = new URLSearchParams();
  searchParams.set("field", "shared");

  const res = await axiosInstance.get(`/notes?${searchParams.toString()}`);
  return res.data;
}

function Shared() {
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: ["notes", "shared"],
    queryFn: fetchSharedNotes,
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
