import { Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unShareNote } from "@/lib/update-note";
import { SharedWith } from "@/types/notes";

type SharedButtonProps = {
  sharedWith: Array<SharedWith>;
  noteId: number;
  onClick(): void;
};

function SharedButton({
  onClick,
  noteId: noteId,
  sharedWith
}: SharedButtonProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: unShareNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });

  const label = "Shared + " + sharedWith.length;

  return (
    <Chip
      label={label}
      variant="outlined"
      onClick={onClick}
      disabled={isPending}
      onDelete={() => {
        mutate(noteId);
      }}
    />
  );
}

export default SharedButton;
