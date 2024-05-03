import { getEdenTreaty } from "libs";

export const api = getEdenTreaty(import.meta.env.VITE_BASE_URL, {
  onRequest(path) {
    if (path.includes("login") || path.includes("register")) return undefined;
    return {
      headers: {
        authorization: "Bearer " + localStorage.getItem("session_token")
      }
    };
  }
});
