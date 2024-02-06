import { cn } from "@/lib/utils";
import IconButton from "@mui/material/IconButton";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

function RefreshButton() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["notes"] }).then(() => {
      toast.success("Refreshed");
    });
  }

  return (
    <IconButton aria-label="refresh" onClick={refresh}>
      <RefreshCw
        className={cn(
          "h-5 w-5",
          isFetching > 0 || isMutating > 0 ? "animate-spin" : "",
        )}
      />
    </IconButton>
  );
}

export default RefreshButton;
