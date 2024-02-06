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

import { getResponseObject } from "../../utils/get-response-object";

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

    if (!noteToDelete.exists) {
      return getResponseObject(404, "Resource not Found");
    }

    if (data?.["userId"] !== user.uid) {
      return getResponseObject(401, "Unauthorized");
    }

    await admin().firestore().collection("notes").doc(noteToDelete.id).delete();

    return getResponseObject(
      200,
      JSON.stringify({ id: noteToDelete.id, ...data }),
      "application/json",
    );
  } catch (error: unknown) {
    console.log("🚀 ~ error:", error);
    if (error instanceof ValiError)
      return getResponseObject(422, error.message);

    if (error instanceof AuthorizationError)
      return getResponseObject(401, error.message);

    if (isFirebaseError(error)) {
      const message = getFirebaseErrorMessage(error.code);
      const statusCode = message.toLocaleLowerCase().startsWith("something")
        ? 500
        : 400;
      return getResponseObject(statusCode, message);
    }

    return getResponseObject(500, "Something went wrong");
  }
}
