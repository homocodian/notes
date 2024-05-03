import { axiosInstance } from "./axios";

type DeleteNoteProps = {
  id: string;
};

export async function deleteNote({ id }: DeleteNoteProps) {
  const res = await axiosInstance.delete(`/notes?id=${id}`);
  return res.data;
}
