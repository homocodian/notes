import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";

import NoteSkeleton from "@/components/NoteSkeleton";
import NoteCard from "@/components/main/NoteCard";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance, destroyInterceptor, getInterceptor } from "@/lib/axios";
import { type Note } from "@/types/notes";
import { useQuery } from "@tanstack/react-query";
import EmptyNote from "../EmptyNote";

async function fetchNotes(
  uid: string | null | undefined,
  token: string | null,
) {
  if (!uid || !token) {
    return Promise.reject("Invalid token");
  }
  const searchParams = new URLSearchParams();
  searchParams.set("user", uid);

  getInterceptor(token);
  const res = await axiosInstance
    .get(`/notes?${searchParams.toString()}`)
    .finally(() => {
      destroyInterceptor();
    });
  return res.data;
}

function Notes() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["notes", user?.uid, token],
    queryFn: () => fetchNotes(user?.uid, token),
    enabled: !!user,
  });

  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);

  const searchString = searchParams.get("q");

  useEffect(() => {
    const query = searchParams.get("q");

    if (!query) {
      return;
    }

    setSearchedNotes(
      (notes || []).filter((item) => {
        if (
          item.text?.toLocaleLowerCase()?.includes(query?.toLocaleLowerCase())
        ) {
          return item;
        }
      }),
    );
  }, [searchParams, notes]);

  if (isLoading) {
    return <NoteSkeleton />;
  }

  return (
    <Fragment>
      {!notes ||
      notes.length <= 0 ||
      (searchedNotes.length <= 0 && searchString) ? (
        <EmptyNote />
      ) : (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={1.5}>
            {(searchedNotes.length > 0 && searchParams.get("q")
              ? searchedNotes
              : notes
            ).map((note) => {
              const labelText = (note.name ||
                note.email ||
                "a friend") as string;

              const isShared =
                note.sharedWith &&
                note.sharedWith?.findIndex(
                  (item) =>
                    item.trim() === user?.uid || item.trim() === user?.email,
                ) >= 0
                  ? true
                  : false;

              return (
                <NoteCard
                  key={note.id}
                  {...{
                    ...note,
                    isShared,
                    label: `Shared by ${
                      labelText.length > 24
                        ? labelText.substring(0, 24) + "..."
                        : labelText
                    }`,
                  }}
                />
              );
            })}
          </Masonry>
        </Box>
      )}
    </Fragment>
  );
}

export default Notes;
