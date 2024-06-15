import { Platform } from "react-native";

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import migrations from "./model/migrations";
import Note from "./model/note";
import schema from "./model/schema";
import { SharedWithNote } from "./model/shared-with";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === "ios",
  onSetUpError: (_error) => {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ _error:", _error);
    // Database failed to load -- offer the user to reload the app or log out
  }
});

export const database = new Database({
  adapter,
  modelClasses: [Note, SharedWithNote]
});
