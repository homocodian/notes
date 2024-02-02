import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { ValiError, object, safeParse, string } from "valibot";
import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getHeaders } from "../../utils/get-headers";
import { isFirebaseError } from "../../utils/is-firebase-error";
import {
  AuthorizationError,
  verifyFirebaseToken,
} from "../../utils/validate-user";

const queryParamsSchema = object({
  user: string("User is not specified"),
  id: string("Note id is not specified"),
});

export default async function DELETE(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const queryParams = safeParse(queryParamsSchema, event.queryStringParameters);

  if (!queryParams.success) {
    return {
      statusCode: 404,
      body: queryParams.issues[0].message,
      headers: getHeaders(),
    };
  }

  const token = event.headers["authorization"]?.split(" ")?.[1];

  try {
    const user = await verifyFirebaseToken({
      uid: queryParams.output.user,
      token,
    });

    const noteToDelete = await admin()
      .firestore()
      .collection("notes")
      .doc(queryParams.output.id)
      .get();

    const data = noteToDelete?.data();

    if (!noteToDelete.exists || data?.["userId"] !== user.uid) {
      return {
        statusCode: !noteToDelete.exists ? 404 : 401,
        body: !noteToDelete.exists ? "Resource not Found" : "Unauthorized",
        headers: getHeaders(),
      };
    }

    await admin().firestore().collection("notes").doc(noteToDelete.id).delete();

    return {
      statusCode: 200,
      body: JSON.stringify({ id: noteToDelete.id, ...data }),
      headers: getHeaders("application/json"),
    };
  } catch (error: unknown) {
    console.log("🚀 ~ error:", error);
    if (error instanceof ValiError) {
      return {
        statusCode: 422,
        body: error.message,
        headers: getHeaders(),
      };
    }

    if (error instanceof AuthorizationError) {
      return {
        statusCode: 401,
        body: error.message,
        headers: getHeaders(),
      };
    }

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

    return {
      statusCode: 500,
      body: "Something went wrong",
      headers: getHeaders(),
    };
  }
}
