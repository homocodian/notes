import Elysia from "elysia";

export function errorHandlerInstance(app: Elysia) {
  return app.onError(({ error, code }) => {
    console.log("🚀 ~ errorHandlerInstance ~  error, code:", error, code);

    if (code === "VALIDATION") {
      return error.all[0]?.schema?.description ??
        error.message.includes("supabase")
        ? "Something went wrong"
        : error.message;
    }

    if (error.message) {
      return error.message.includes("supabase")
        ? "Something went wrong"
        : error.message;
    }

    return error;
  });
}
