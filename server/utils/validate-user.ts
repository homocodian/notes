import { admin } from "../firebase/admin";

type VerifyFirebaseToken = {
  uid?: string;
  token?: string;
};

export async function verifyFirebaseToken({ uid, token }: VerifyFirebaseToken) {
  if (!token || !uid) throw new Error("Invalid credentials");

  const data = await admin().auth().verifyIdToken(token);
  if (data.uid !== uid) throw new Error("Invalid credentials");

  return data;
}
