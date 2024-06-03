import { appSchema, ColumnSchema, tableSchema } from "@nozbe/watermelondb";

export const Table = {
  note: {
    name: "note",
    columns: [
      { name: "text", type: "string" },
      { name: "category", type: "string" },
      { name: "is_complete", type: "boolean" },
      { name: "user_id", type: "number" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ] satisfies ColumnSchema[]
  }
} as const;

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: Table.note.name,
      columns: Table.note.columns
    })
  ]
});
