import { treaty } from "@elysiajs/eden";
import { API } from "../../../server/src";

export const api = treaty<API>(import.meta.env.VITE_BASE_URL, {
  onRequest(path) {
    if (path.includes("login") || path.includes("register")) return undefined;
    return {
      headers: {
        authorization: "Bearer " + localStorage.getItem("session_token"),
      },
    };
  },
});
