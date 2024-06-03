import { Platform } from "react-native";

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import Note from "./model/note";
// import migrations from "./model/migrations";
import schema from "./model/schema";

const adapter = new SQLiteAdapter({
  schema,
  // migrations,
  jsi: Platform.OS === "ios",
  onSetUpError: (_error) => {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ _error:", _error);
    // Database failed to load -- offer the user to reload the app or log out
  }
});

export const database = new Database({
  adapter,
  modelClasses: [Note]
});
