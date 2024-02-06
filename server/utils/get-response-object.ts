import { ContentType, getHeaders } from "./get-headers";

export function getResponseObject(
  statusCode: number,
  message: string,
  contentType?: ContentType,
) {
  return {
    statusCode,
    body: message,
    headers: getHeaders(contentType),
  };
}
