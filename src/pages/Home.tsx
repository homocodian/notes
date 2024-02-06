import { Fragment, useCallback, useState } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import AddButton from "@/components/main/AddButton";
import AddNoteModal from "@/components/main/AddNoteModal";
import Notes from "@/components/main/Notes";
import {
  changeStatusbarColor,
  setStatusbarColor,
} from "@/utils/change-statusbar-color";
import { Style } from "@capacitor/status-bar";
import { useTernaryDarkMode } from "usehooks-ts";

function Home() {
  const { isDarkMode } = useTernaryDarkMode();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const handleAddNoteModalState = useCallback(
    (prop: boolean) => {
      setIsNoteModalOpen(prop);
      if (prop === true) {
        const color = isDarkMode ? "#383838" : "#ffffff";
        const style = isDarkMode ? Style.Dark : Style.Light;
        setStatusbarColor(color, style);
      } else {
        changeStatusbarColor(isDarkMode);
      }
    },
    [isDarkMode, Style],
  );

  useHotkeys(
    "shift+n",
    () => {
      if (isNoteModalOpen) {
        return;
      }
      setIsNoteModalOpen(true);
    },
    [isNoteModalOpen],
  );

  return (
    <Fragment>
      <>
        <Notes />
        <AddNoteModal
          open={isNoteModalOpen}
          setOpen={handleAddNoteModalState}
        />
      </>
      <AddButton openAddTodoModal={handleAddNoteModalState} />
    </Fragment>
  );
}

export default Home;
