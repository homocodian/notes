import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { APIError } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth";

// Create a client
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error) => {
      if (import.meta.env.DEV) console.log(error);

      if (error instanceof APIError) {
        if (error.status === 401) {
          toast.error("Please login again");
          useAuthStore.getState().logout();
          return;
        }

        toast.error(`${error.message}`);
      } else toast.error(`Something went wrong: ${error.message}`);
    }
  }),
  mutationCache: new MutationCache({
    onError: async (error) => {
      if (import.meta.env.DEV) console.log(error);

      if (error instanceof APIError) {
        if (error.status === 401) {
          toast.error("Please login again");
          useAuthStore.getState().logout();
          return;
        }

        toast.error(`${error.message}`);
      } else toast.error(`Something went wrong: ${error.message}`);
    }
  }),
  defaultOptions: {
    mutations: {
      retry: 2
    }
  }
});
