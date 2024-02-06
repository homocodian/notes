import { axiosInstance, destroyInterceptor, getInterceptor } from "./axios";

export type UpdateNoteProps = {
  uid: string | null | undefined;
  token: string | null;
  id: string;
  data: {
    text?: string;
    isComplete?: boolean;
    category?: string;
  };
};

export async function updateNote({ token, uid, id, data }: UpdateNoteProps) {
  if (!uid || !token) {
    return Promise.reject("Invalid id token");
  }

  const queryParams = new URLSearchParams();
  queryParams.set("user", uid);
  queryParams.set("id", id);

  getInterceptor(token);
  const res = await axiosInstance
    .patch(`/notes?${queryParams.toString()}`, data)
    .finally(() => {
      destroyInterceptor();
    });
  return res.data;
}
