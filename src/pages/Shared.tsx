import { useEffect, useState } from "react";

import EmptyNote from "@/components/EmptyNote";
import { NoteCard } from "@/components/main";
import NoteSkeleton from "@/components/NoteSkeleton";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance, destroyInterceptor, getInterceptor } from "@/lib/axios";
import { Note } from "@/types/notes";
import { Masonry } from "@mui/lab";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

async function fetchSharedNotes(
  uid: string | null | undefined,
  token: string | null,
) {
  if (!uid || !token) {
    return Promise.reject("Invalid token");
  }
  const searchParams = new URLSearchParams();
  searchParams.set("user", uid);
  searchParams.set("field", "shared");

  getInterceptor(token);
  const res = await axiosInstance
    .get(`/notes?${searchParams.toString()}`)
    .finally(() => {
      destroyInterceptor();
    });
  return res.data;
}

function Shared() {
  const { user, token } = useAuth();
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: ["notes", "shared", user?.uid, token],
    queryFn: () => fetchSharedNotes(user?.uid, token),
    enabled: !!user,
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
              const labelText = (note.name ||
                note.email ||
                "a friend") as string;
              return (
                <NoteCard {...note} isShared label={labelText} key={note.id} />
              );
            })}
          </Masonry>
        </div>
      )}
    </>
  );
}

export default Shared;
