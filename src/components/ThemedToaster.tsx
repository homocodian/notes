import { Toaster } from "react-hot-toast";
import { useTernaryDarkMode } from "usehooks-ts";

function ThemedToaster() {
  const { isDarkMode } = useTernaryDarkMode();
  return (
    <Toaster
      toastOptions={{
        position: "bottom-center",
        style: {
          backgroundColor: !isDarkMode ? "#121212" : undefined,
          color: !isDarkMode ? "#ffffff" : undefined,
          borderRadius: 999,
          fontFamily: "system-ui",
        },
      }}
    />
  );
}

export default ThemedToaster;
