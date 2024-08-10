import { Platform } from "react-native";

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
import { randomUUID } from "expo-crypto";

import { useUserStore } from "../store/user";
import { migrations } from "./model/migrations";
import Note from "./model/note";
import schema from "./model/schema";

setGenerator(() => randomUUID());

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === "ios",
  onSetUpError: async (_error) => {
    console.log("🚀 ~ _error:", _error);
    // Database failed to load -- offer the user to reload the app or log out
    useUserStore.getState().setUser(null);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [Note]
});

export const collections = {
  note: [
    "id",
    "text",
    "category",
    "is_complete",
    "user_id",
    "created_at",
    "updated_at",
    "deleted_at"
  ]
};
