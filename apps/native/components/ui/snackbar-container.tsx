import React from "react";
import { Portal, Snackbar } from "react-native-paper";

import { useSnackbar } from "./use-snackbar";

type SnackbarContainerProps = {
  children?: React.ReactNode | ((contentLength: number) => React.ReactNode);
};

function SnackbarContainer({ children }: SnackbarContainerProps) {
  const { Snackbars } = useSnackbar();
  return (
    <>
      {typeof children === "function" ? children(Snackbars.length) : children}
      <Portal>
        {Snackbars.map(({ text, id, ...props }) => (
          <Snackbar key={id} {...props} className="mx-2">
            {text}
          </Snackbar>
        ))}
      </Portal>
    </>
  );
}

export { SnackbarContainer };
