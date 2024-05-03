import { api } from "./eden";

export type ModifyNoteProps<T = Record<string, unknown>> = {
  id: string;
  data: T;
};

export async function updateNote({ id, data }: ModifyNoteProps) {
  const res = await api.v1.notes({ id }).patch(data);
  return res.data;
}

export async function shareNote({ id, data }: ModifyNoteProps<Array<string>>) {
  const res = await api.v1.notes({ id }).share.post(data);
  return res.data;
}
