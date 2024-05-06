import { APIError } from "./api-error";
import { api } from "./eden";

export type ModifyNoteProps<T = Record<string, unknown>> = {
  id: number;
  data: T;
};

export async function updateNote({ id, data }: ModifyNoteProps) {
  const res = await api.v1.notes({ id }).patch(data);

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}

export async function shareNote({ id, data }: ModifyNoteProps<Array<string>>) {
  const res = await api.v1.notes({ id }).share.post(data);

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}

export async function removeUserFromNote({
  id,
  data
}: ModifyNoteProps<string>) {
  const res = await api.v1.notes({ id }).share.patch(data);

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}

export async function unShareNote(id: number) {
  const res = await api.v1.notes({ id }).share.delete();

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}

export async function removeSharedNote(id: number) {
  const res = await api.v1.notes({ id }).share.me.delete();

  if (res.error) {
    throw new APIError(res.error.value, res.error.status);
  }

  return res.data;
}
