import { Fragment, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import AddButton from "@/components/main/AddButton";
import AddNoteModal from "@/components/main/AddNoteModal";
import Notes from "@/components/main/Notes";

function Home() {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useHotkeys(
    "shift+n",
    () => {
      if (isNoteModalOpen) {
        return;
      }
      setIsNoteModalOpen(true);
    },
    [isNoteModalOpen]
  );

  return (
    <Fragment>
      <>
        <Notes />
        <AddNoteModal open={isNoteModalOpen} setOpen={setIsNoteModalOpen} />
      </>
      <AddButton openAddTodoModal={setIsNoteModalOpen} />
    </Fragment>
  );
}

export default Home;
