import React, { useMemo } from "react";
import { FAB } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { useNavigation, useRoute } from "@react-navigation/native";

import { useSnackbar } from "../ui/use-snackbar";

export function AddNoteButton() {
  const route = useRoute();
  const navigation = useNavigation();
  const translateY = useSharedValue(0);
  const { Snackbars } = useSnackbar();

  const category = route.name.includes("General")
    ? "general"
    : route.name.includes("Important")
      ? "important"
      : null;

  const contentLength = useMemo(() => Snackbars.length, [Snackbars.length]);

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

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={animatedStyle}>
      <FAB
        icon="plus"
        className="absolute m-4 right-0 bottom-0"
        onPress={() => {
          navigation.navigate("Editor", { category });
        }}
      />
    </Animated.View>
  );
}
