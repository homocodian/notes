import { queryClient } from "@/App";
import { useAuth } from "@/context/AuthContext";
import { updateNote } from "@/lib/update-note";
import { Chip } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

type SharedButtonProps = {
  sharedWith: string[];
  id: string;
  onClick(): void;
};

function SharedButton({ onClick, id, sharedWith }: SharedButtonProps) {
  const { token, user } = useAuth();

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
          token,
          uid: user?.uid,
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
