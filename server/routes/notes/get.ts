import { HandlerEvent, HandlerResponse } from "@netlify/functions";

import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getHeaders } from "../../utils/get-headers";
import { isFirebaseError } from "../../utils/is-firebase-error";
import { verifyFirebaseToken } from "../../utils/validate-user";

export default async function GET(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const query = event.queryStringParameters;

  if (!query || !query["user"]) {
    return {
      statusCode: 404,
      body: "User not specified",
      headers: getHeaders(),
    };
  }

  const token = event.headers["authorization"]?.split(" ")?.[1];
  const uid = query["user"];

  try {
    const user = await verifyFirebaseToken({ uid, token });
    const data = await admin()
      .firestore()
      .collection("notes")
      .where("userId", "==", user.uid)
      .get();

    const notes = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify(notes),
      headers: getHeaders("application/json"),
    };
  } catch (error: unknown) {
    if (isFirebaseError(error)) {
      const message = getFirebaseErrorMessage(error.code);
      return {
        statusCode: message.toLocaleLowerCase().startsWith("something")
          ? 500
          : 400,
        body: message,
        headers: getHeaders(),
      };
    }

    if (error instanceof Error) {
      return {
        statusCode: 401,
        body: error.message,
        headers: getHeaders(),
      };
    }

    return {
      statusCode: 500,
      body: "Something went wrong",
      headers: getHeaders(),
    };
  }
}
