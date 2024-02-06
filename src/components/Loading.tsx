import { useTheme } from "@/hooks/useTheme";
import { Loader2 } from "lucide-react";

function Loading() {
  const { theme } = useTheme();
  return (
    <div
      className="h-full flex justify-center items-center"
      style={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Loader2
        className="animate-spin"
        style={{
          color: theme.palette.text.secondary,
        }}
      />
    </div>
  );
}

export default Loading;
