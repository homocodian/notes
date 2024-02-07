import { HandlerEvent, HandlerResponse } from "@netlify/functions";

import { Filter } from "firebase-admin/firestore";
import {
  ValiError,
  custom,
  object,
  optional,
  parse,
  picklist,
  string,
} from "valibot";
import { admin } from "../../firebase/admin";
import { getFirebaseErrorMessage } from "../../utils/format-firebase-error";
import { getResponseObject } from "../../utils/get-response-object";
import { isFirebaseError } from "../../utils/is-firebase-error";
import {
  AuthorizationError,
  verifyFirebaseToken,
} from "../../utils/validate-user";

const queryParamsSchema = object(
  {
    user: string("User is not specified"),
    field: optional(
      picklist(
        ["text", "category", "shared"],
        "field can be text,category or shared",
      ),
    ),
    q: optional(string("query text is required")),
  },
  [
    custom(({ field, q }) => {
      // if both undefined then PASS
      if (!field && !q) return true;

      if (field === "shared") return true;

      // if both defined then a then pass
      if (field && q) return true;

      return false;
    }, "'field' and 'q' both query params are required"),

    custom(({ field, q }) => {
      // if both undefined then PASS
      if (!field && !q) return true;

      if (field === "text") return true;

      if (field === "shared") return true;

      if (field === "category" && (q === "general" || q === "important"))
        return true;

      return false;
    }, "'q' must be general or important"),

    custom(({ field, q }) => {
      // if both undefined then PASS
      if (!field && !q) return true;

      if (field === "text") return false;

      return true;
    }, "text query is not supported at this moment"),
  ],
);

export default async function GET(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const queryParams = parse(queryParamsSchema, event.queryStringParameters);

    const token = event.headers["authorization"]?.split(" ")?.[1];

    const user = await verifyFirebaseToken({
      uid: queryParams.user,
      token,
    });

    let filter = Filter.or(
      Filter.where("userId", "==", user.uid),
      Filter.where("sharedWith", "array-contains-any", [user.uid, user.email]),
    );

    if (
      queryParams.field &&
      queryParams.q &&
      queryParams.field === "category"
    ) {
      filter = Filter.and(
        Filter.where("userId", "==", user.uid),
        Filter.where(queryParams.field, "==", queryParams.q),
      );
    } else if (queryParams.field === "shared") {
      filter = Filter.or(
        Filter.where("sharedWith", "array-contains", user.uid),
        Filter.where("sharedWith", "array-contains", user.email),
      );
    }

    const data = await admin()
      .firestore()
      .collection("notes")
      .where(filter)
      .orderBy("updatedAt", "desc")
      .get();

    const notes = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return getResponseObject(200, JSON.stringify(notes), "application/json");
  } catch (error: unknown) {
    console.log("🚀 ~ error:", error);
    if (error instanceof ValiError)
      return getResponseObject(400, error.issues[0].message);

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
