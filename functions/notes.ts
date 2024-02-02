import { Handler } from "@netlify/functions";
import { GET } from "../server/routes/notes";
import { getHeaders } from "../server/utils/get-headers";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") return GET(event);
  return {
    statusCode: 405,
    body: "Method not allowed",
    headers: getHeaders(),
  };
};
