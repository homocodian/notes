import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { Timestamp } from "firebase-admin/firestore";
import { ValiError, object, parse, picklist, string } from "valibot";
import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getHeaders } from "../../utils/get-headers";
import { isFirebaseError } from "../../utils/is-firebase-error";
import { verifyFirebaseToken } from "../../utils/validate-user";

const noteSchema = object({
  text: string("Text must be string"),
  category: picklist(
    ["general", "important"],
    "Category must be either general or important",
  ),
});

export default async function POST(
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
