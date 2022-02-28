import { useEffect } from "react";
import NoteCard from "./NoteCard";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import { useAppState } from "../../context/AppState";
import { useNotes, useCategoryNotes } from "../../hooks";
import { useMediaQuery, useTheme } from "@mui/material";
import { NOTES, useCategory } from "../../context/NotesCategoryProvider";
import { experimentalStyled as styled } from "@mui/material/styles";

interface ITodos {
  setAlert: (prop: boolean) => void;
}

function Notes({ setAlert }: ITodos) {
  const notes = useNotes();
  const theme = useTheme();
  const { category } = useCategory();
  const { isLoading } = useAppState();
  const categoryNotes = useCategoryNotes(category);

  useEffect(() => {
    if (isLoading) {
      return;
    } else if (!notes.length) setAlert(true);
    else setAlert(false);
  }, [notes, setAlert, category, isLoading]);

  return (
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
  );
}

export default Notes;
