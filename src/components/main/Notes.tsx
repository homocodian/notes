import { Fragment, useEffect, useState } from "react";

import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";

import NoteCard from "./NoteCard";
import { useNotes, useCategoryNotes } from "../../hooks";
import { NOTES, useCategory } from "../../context/NotesCategoryProvider";
import AlertMessage from "../AlertMessage";

function Notes() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notes, loading, error] = useNotes();
  const { category } = useCategory();
  const categoryNotes = useCategoryNotes(category);

  useEffect(() => {
    if (loading) return;
    if (category === "general") {
      if (!notes.length) {
        setMessage("Notes not found");
        setOpen(true);
      } else {
        setMessage(null);
        setOpen(false);
      }
    } else {
      if (!categoryNotes.length) {
        setMessage("Notes not found");
        setOpen(true);
      } else {
        setMessage(null);
        setOpen(false);
      }
    }
  }, [notes, category, loading, categoryNotes]);

  useEffect(() => {
    if (error) {
      setMessage(error);
      setOpen(true);
    }
  }, [error]);

  return (
    <Fragment>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {category === NOTES.GENERAL
            ? notes.map((note) => {
                const { text, isComplete, category, timestamp } = note.data();
                return (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    text={text}
                    isComplete={isComplete}
                    category={category}
                    timestamp={timestamp?.toDate()}
                  />
                );
              })
            : categoryNotes.map((note) => {
                const { text, isComplete, category, timestamp } = note.data();
                return (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    text={text}
                    isComplete={isComplete}
                    category={category}
                    timestamp={timestamp?.toDate()}
                  />
                );
              })}
        </Masonry>
      </Box>
      <AlertMessage
        open={open}
        message={message}
        setOpen={setOpen}
        severity="warning"
      />
    </Fragment>
  );
}

export default Notes;
