import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Portal, Snackbar } from "react-native-paper";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { ToasterSnackbar, useSnackbar } from "./use-snackbar";

function SnackbarContainer() {
  const { Snackbars, dismiss } = useSnackbar();

  return (
    <>
      {Snackbars.map((props) => (
        <Portal key={props.id}>
          <Wrapper dismiss={dismiss} {...props} />
        </Portal>
      ))}
    </>
  );
}

function Wrapper({
  dismiss,
  id,
  text,
  swipeToDismiss: swipeable,
  ...props
}: ToasterSnackbar & { dismiss: (SnackbarId?: string) => void }) {
  const offset = useSharedValue(0);
  const { width } = useWindowDimensions();

  const threshold = useMemo(() => width / 2.5, [width]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(swipeable)
      .onChange((event) => {
        offset.value = event.translationX;
      })
      .onFinalize(() => {
        if (Math.abs(offset.value) >= threshold) {
          offset.value = withTiming(
            offset.value > 0 ? width : -width,
            {
              duration: 100,
              easing: Easing.linear
            },
            () => runOnJS(dismiss)(id)
          );
        } else {
          offset.value = withTiming(0, {
            duration: 100,
            easing: Easing.linear
          });
        }
      });
  }, [id, threshold, width, swipeable]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute inset-0 bottom-0 w-full"
        style={animatedStyle}
      >
        <Snackbar {...props} className="mx-2">
          {text}
        </Snackbar>
      </Animated.View>
    </GestureDetector>
  );
}

export { SnackbarContainer };
