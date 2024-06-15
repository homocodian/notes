import React, { useMemo } from "react";
import { FAB } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { Link, usePathname, useSegments } from "expo-router";

export function AddNoteButton({ contentLength }: { contentLength?: number }) {
  const translateY = useSharedValue(0);
  const segments = useSegments();
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  React.useEffect(() => {
    translateY.value = withTiming(
      contentLength && contentLength > 0 ? -60 : 0,
      {
        duration: 100
      }
    );
  }, [contentLength]);

  if (isSearchScreen || !segments.includes("(drawer)")) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={animatedStyle}>
      <Link
        asChild
        href={category ? `/note/editor?category=${category}` : "/note/editor"}
      >
        <FAB icon="plus" className="absolute m-4 right-0 bottom-0" />
      </Link>
    </Animated.View>
  );
}
