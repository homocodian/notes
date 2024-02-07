import type { NoteToUpdate } from "server/validations/notes";
import { axiosInstance } from "./axios";

export type UpdateNoteProps = {
  id: string;
  data: NoteToUpdate;
};

export async function updateNote({ id, data }: UpdateNoteProps) {
  const res = await axiosInstance.patch(`/notes?id=${id}`, data);
  return res.data;
}
