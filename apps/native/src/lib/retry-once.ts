/**
 * Retries a given async function once if it fails.
 *
 * @param asyncFunction The async function to be retried.
 * @returns The result of the async function if successful, or throws an error.
 */
export async function retryOnce<T>(
  asyncFunction: () => Promise<T>
): Promise<T> {
  try {
    // First attempt
    return await asyncFunction();
  } catch (error) {
    console.error("First attempt failed, retrying once...", error);
    // Second and final attempt
    return await asyncFunction();
  }
}
