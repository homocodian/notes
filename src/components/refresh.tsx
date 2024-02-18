import { cn } from "@/lib/utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";
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
    <Tooltip title="Refresh">
      <IconButton aria-label="refresh" onClick={refresh}>
        <RefreshIcon
          className={cn(
            "h-5 w-5 text-white",
            isFetching > 0 || isMutating > 0 ? "animate-spin" : "",
          )}
        />
      </IconButton>
    </Tooltip>
  );
}

export default RefreshButton;
