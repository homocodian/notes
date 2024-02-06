import { axiosInstance, destroyInterceptor, getInterceptor } from "./axios";

type DeleteNoteProps = {
  token: string | null;
  uid: string | null | undefined;
  id: string;
};

export async function deleteNote({ token, uid, id }: DeleteNoteProps) {
  if (!uid || !token) {
    return Promise.reject("Invalid id token");
  }

  const queryParams = new URLSearchParams();
  queryParams.set("user", uid);
  queryParams.set("id", id);

  getInterceptor(token);
  const res = await axiosInstance
    .delete(`/notes?${queryParams.toString()}`)
    .finally(() => {
      destroyInterceptor();
    });
  return res.data;
}
