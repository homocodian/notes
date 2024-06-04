import { FAB } from "react-native-paper";

import { Link } from "expo-router";

export function AddNoteButton() {
  return (
    <Link asChild href="/note/editor">
      <FAB icon="plus" className="absolute m-4 right-0 bottom-0" />
    </Link>
  );
}
