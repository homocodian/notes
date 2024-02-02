type ContentType =
  | "application/pdf"
  | "application/json"
  | "application/text"
  | "application/xml"
  | "application/zip"
  | "application/x-www-form-urlencoded";

/**
 *
 * @param contentType [contentType=application/text]
 */
export function getHeaders(
  contentType: ContentType = "application/text",
  // allowedOrgin: string = "*",
) {
  return {
    // "Access-Control-Allow-Origin": allowedOrgin,
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Content-Type": contentType,
  };
}
