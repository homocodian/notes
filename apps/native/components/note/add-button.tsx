import { FAB } from "react-native-paper";

import { Link, usePathname } from "expo-router";

export function AddNoteButton() {
  const pathname = usePathname();

  const category = pathname.includes("general")
    ? "general"
    : pathname.includes("important")
      ? "important"
      : null;

  return (
    <Link
      asChild
      href={category ? `/note/editor?category=${category}` : "/note/editor"}
    >
      <FAB icon="plus" className="absolute m-4 right-0 bottom-0" />
    </Link>
  );
}
