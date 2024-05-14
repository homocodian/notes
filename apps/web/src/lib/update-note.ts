import { fetchAPI } from "./fetch-wrapper";

export type ModifyNoteProps<T = Record<string, unknown>> = {
  id: number;
  data: T;
};

export async function updateNote({ id, data }: ModifyNoteProps) {
  return fetchAPI.patch(`/v1/notes/${id}`, { data });
}

export async function shareNote({ id, data }: ModifyNoteProps<Array<string>>) {
  return fetchAPI.post(`/v1/notes/${id}/share`, { data });
}

export async function removeUserFromNote({
  id,
  data
}: ModifyNoteProps<string>) {
  return fetchAPI.patch(`/v1/notes/${id}/share`, { data });
}

export async function unShareNote(id: number) {
  return fetchAPI.delete(`/v1/notes/${id}/share`);
}

export async function removeSharedNote(id: number) {
  return fetchAPI.delete(`/v1/notes/${id}/share/me`);
}
