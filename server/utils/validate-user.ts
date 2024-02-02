import { admin } from "../firebase/admin";

type VerifyFirebaseToken = {
  uid?: string;
  token?: string;
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export async function verifyFirebaseToken({ uid, token }: VerifyFirebaseToken) {
  if (!token || !uid) throw new Error("Invalid credentials");

  try {
    const data = await admin().auth().verifyIdToken(token);
    if (data.uid !== uid) throw new AuthorizationError("Unauthorized");
    return data;
  } catch (error) {
    throw new AuthorizationError("Unauthorized");
  }
}
