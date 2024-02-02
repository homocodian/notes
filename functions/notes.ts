import { Handler } from "@netlify/functions";
import { GET, PATCH, POST } from "../server/routes/notes";
import { getHeaders } from "../server/utils/get-headers";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") return GET(event);
  if (event.httpMethod === "POST") return POST(event);
  if (event.httpMethod === "PATCH") return PATCH(event);
  return {
    statusCode: 405,
    body: "Method not allowed",
    headers: getHeaders(),
  };
};
