import React from "react";
import { BackHandler } from "react-native";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps
} from "@gorhom/bottom-sheet";

import { useAppTheme } from "@/context/material-3-theme-provider";

type SharedWithSheetProps = {
  children: React.ReactNode;
  setVisible: (value: boolean) => void;
};

export function SharedWithBottomSheet({
  setVisible,
  children
}: SharedWithSheetProps) {
  const theme = useAppTheme();
  const sheetRef = React.useRef<BottomSheet>(null);

  React.useEffect(() => {
    const handleBackButton = () => {
      sheetRef.current?.close();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        style={{ backgroundColor: theme.colors.backdrop }}
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      enablePanDownToClose
      onClose={() => setVisible(false)}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
      backdropComponent={renderBackdrop}
      enableDynamicSizing
      maxDynamicContentSize={400}
    >
      {children}
    </BottomSheet>
  );
}
