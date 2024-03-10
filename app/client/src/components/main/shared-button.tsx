import { updateNote } from "@/lib/update-note";
import { Chip } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SharedButtonProps = {
  sharedWith: string[];
  id: string;
  onClick(): void;
};

function SharedButton({ onClick, id, sharedWith }: SharedButtonProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const label = "Shared + " + sharedWith.length;

  return (
    <Chip
      label={label}
      variant="outlined"
      onClick={onClick}
      disabled={isPending}
      onDelete={() => {
        mutate({
          id,
          data: {
            fieldToDelete: "sharedWith",
          },
        });
      }}
    />
  );
}

export default SharedButton;
