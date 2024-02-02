import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { Timestamp } from "firebase-admin/firestore";
import { ValiError, object, parse, partial, safeParse, string } from "valibot";
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
  id: string("Note id is not specified"),
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
    const parsedData = parse(partial(noteSchema), json);

    const dataToUpdate = {
      ...(parsedData.text ? { text: parsedData.text } : {}),
      ...(parsedData.category ? { category: parsedData.category } : {}),
      updatedAt: Timestamp.now(),
    };

    const noteToUpdate = await admin()
      .firestore()
      .collection("notes")
      .doc(queryParams.output.id)
      .get();

    const data = noteToUpdate?.data();

    if (!noteToUpdate.exists || data?.["userId"] !== user.uid) {
      return {
        statusCode: !noteToUpdate.exists ? 404 : 401,
        body: !noteToUpdate.exists ? "Resource not Found" : "Unauthorized",
        headers: getHeaders(),
      };
    }

    await admin()
      .firestore()
      .collection("notes")
      .doc(noteToUpdate.id)
      .update(dataToUpdate);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...data, ...dataToUpdate }),
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
