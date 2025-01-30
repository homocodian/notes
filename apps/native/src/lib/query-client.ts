import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient();

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
});
