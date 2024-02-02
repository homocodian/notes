import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { Timestamp } from "firebase-admin/firestore";
import { ValiError, object, parse, safeParse, string } from "valibot";
import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getHeaders } from "../../utils/get-headers";
import { isFirebaseError } from "../../utils/is-firebase-error";
import {
  AuthorizationError,
  verifyFirebaseToken,
} from "../../utils/validate-user";
import { noteSchema } from "../../validations/notes";

const queryParamsSchema = object({
  user: string("User is not specified"),
});

export default async function POST(
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

    if (!event.body) {
      throw new Error("Invalid fields");
    }

    const json = JSON.parse(event.body);
    const parsedData = parse(noteSchema, json);

    const data = {
      ...parsedData,
      userId: user.uid,
      name: user.displayName || null,
      email: user.email,
      timestamp: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await admin().firestore().collection("notes").doc().create(data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: getHeaders("application/json"),
    };
  } catch (error: unknown) {
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
