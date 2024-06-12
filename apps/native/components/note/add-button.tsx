import { useMemo } from "react";
import { FAB } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Link, usePathname } from "expo-router";

export function AddNoteButton() {
  const pathname = usePathname();

  const category = pathname.includes("general")
    ? "general"
    : pathname.includes("important")
      ? "important"
      : null;

  const isSearchScreen = useMemo(() => {
    if (pathname === "/search") {
      return true;
    } else return false;
  }, [pathname]);

  if (isSearchScreen) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Link
        asChild
        href={category ? `/note/editor?category=${category}` : "/note/editor"}
      >
        <FAB icon="plus" className="absolute m-4 right-0 bottom-0" />
      </Link>
    </Animated.View>
  );
}
