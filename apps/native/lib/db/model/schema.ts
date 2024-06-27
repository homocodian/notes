import { appSchema, ColumnSchema, tableSchema } from "@nozbe/watermelondb";

export const Table = {
  note: {
    name: "note",
    columns: [
      { name: "text", type: "string" },
      { name: "category", type: "string" },
      { name: "is_complete", type: "boolean" },
      { name: "user_id", type: "number", isIndexed: true },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      {
        name: "deleted_at",
        type: "number",
        isOptional: true,
        isIndexed: true
      }
    ] satisfies ColumnSchema[]
  }
} as const;

export type TableSchema = typeof Table;

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: Table.note.name,
      columns: Table.note.columns
    })
  ]
});
