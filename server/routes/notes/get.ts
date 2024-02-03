import { HandlerEvent, HandlerResponse } from "@netlify/functions";

import { Filter } from "firebase-admin/firestore";
import { object, safeParse, string } from "valibot";
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
});

export default async function GET(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const queryParams = safeParse(queryParamsSchema, event.queryStringParameters);

  if (!queryParams.success) {
    return {
      statusCode: 400,
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

    const data = await admin()
      .firestore()
      .collection("notes")
      .where(
        Filter.or(
          Filter.where("userId", "==", user.uid),
          Filter.where("sharedWith", "array-contains-any", [
            user.uid,
            user.email,
          ]),
        ),
      )
      .orderBy("updatedAt", "desc")
      .get();

    const notes = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify(notes),
      headers: getHeaders("application/json"),
    };
  } catch (error: unknown) {
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
