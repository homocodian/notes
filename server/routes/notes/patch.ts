import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { ValiError, object, parse, safeParse, string } from "valibot";
import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getHeaders } from "../../utils/get-headers";
import { getResponseObject } from "../../utils/get-response-object";
import { isFirebaseError } from "../../utils/is-firebase-error";
import {
  AuthorizationError,
  verifyFirebaseToken,
} from "../../utils/validate-user";
import { noteToUpdateSchema } from "../../validations/notes";

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

    if (!event.body) {
      throw new Error("Invalid fields");
    }

    // validation
    const json = JSON.parse(event.body);
    const parsedData = parse(noteToUpdateSchema, json);

    if (!Object.keys(parsedData).length) {
      return getResponseObject(
        400,
        "Nothing received to update, give some data to update",
      );
    }

    // data which must be updated
    let dataToUpdate = {
      ...parsedData,
      updatedAt: Timestamp.now(),
    };

    // get current data
    const noteToUpdate = await admin()
      .firestore()
      .collection("notes")
      .doc(queryParams.output.id)
      .get();
    const data = noteToUpdate?.data();

    if (!noteToUpdate.exists) {
      return getResponseObject(404, "Resource not Found");
    } else if (
      data?.["userId"] !== user.uid &&
      (!dataToUpdate.removeSharedWith || !dataToUpdate.removeSharedWith.length)
    ) {
      throw new AuthorizationError("unathorized");
    }

    if (dataToUpdate.sharedWith) {
      dataToUpdate = {
        ...dataToUpdate,

        // @ts-expect-error can be firestore field value
        sharedWith: FieldValue.arrayUnion(
          ...dataToUpdate.sharedWith
            .filter(Boolean)
            .filter((item) => item !== user.uid && item !== user.email),
        ),
      };
    }

    if (dataToUpdate.removeSharedWith) {
      dataToUpdate = {
        // @ts-expect-error can be firestore field value
        sharedWith: FieldValue.arrayRemove(
          ...dataToUpdate.removeSharedWith.filter(Boolean),
        ),
      };
    }

    if (dataToUpdate.fieldToDelete) {
      dataToUpdate = {
        ...dataToUpdate,
        // @ts-expect-error can be fieldvalue
        [dataToUpdate.fieldToDelete]: FieldValue.delete(),
      };
    }

    delete dataToUpdate["removeSharedWith"];
    delete dataToUpdate["fieldToDelete"];

    // update data
    await admin()
      .firestore()
      .collection("notes")
      .doc(noteToUpdate.id)
      .update(dataToUpdate);

    return getResponseObject(
      200,
      JSON.stringify({ ...data, ...dataToUpdate }),
      "application/json",
    );
  } catch (error: unknown) {
    console.log("🚀 ~ error:", error);
    if (error instanceof ValiError) {
      return getResponseObject(422, error.message);
    }

    if (error instanceof AuthorizationError) {
      return getResponseObject(401, error.message);
    }

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
