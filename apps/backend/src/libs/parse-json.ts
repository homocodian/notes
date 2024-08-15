type ParseJsonResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// Overload for asynchronous parsing (Response)
export async function parseJson<T = Record<string, unknown>>(
  toParse: Response
): Promise<ParseJsonResponse<T>>;

// Overload for synchronous parsing (string)
export function parseJson<T = Record<string, unknown>>(
  toParse: unknown
): ParseJsonResponse<T>;

// Implementation
export function parseJson<T = Record<string, unknown>>(
  toParse: unknown
): ParseJsonResponse<T> | Promise<ParseJsonResponse<T>> {
  if (toParse instanceof Response) {
    return toParse
      .json()
      .then((data) => ({ data, error: null }))
      .catch(() => ({ data: null, error: "Invalid JSON" }));
  }

  if (typeof toParse === "string") {
    try {
      const data = JSON.parse(toParse);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: "Invalid JSON" };
    }
  }

  return { data: null, error: "Invalid input" };
}
