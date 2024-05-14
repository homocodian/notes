import { fetchAPI } from "./fetch-wrapper";

type DeleteNoteProps = {
  id: number;
};

export async function deleteNote({ id }: DeleteNoteProps) {
  return fetchAPI.delete(`/v1/notes/${id}`);
}
