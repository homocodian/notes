import { auth } from "@/firebase";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

// Create a client
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error) => {
      if (import.meta.env.DEV) console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login again");
          await signOut(auth);
          return;
        }
        toast.error(`${error.response?.data}`);
      } else toast.error(`Something went wrong: ${error.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: async (error) => {
      if (import.meta.env.DEV) console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login again");
          await signOut(auth);
          return;
        }
        toast.error(`${error.response?.data}`);
      } else toast.error(`Something went wrong: ${error.message}`);
    },
  }),
});
