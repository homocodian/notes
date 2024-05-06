import { APIError } from "./api-error";
import { api } from "./eden";

type DeleteNoteProps = {
  id: number;
};

export async function deleteNote({ id }: DeleteNoteProps) {
  const res = await api.v1.notes({ id }).delete();

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}
