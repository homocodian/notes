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
        type: "string",
        isOptional: true,
        isIndexed: true
      }
    ] satisfies ColumnSchema[]
  },
  sharedWith: {
    name: "shared_with",
    columns: [
      {
        name: "note_id",
        type: "string",
        isIndexed: true
      },
      {
        name: "user_email",
        type: "string"
      },
      {
        name: "status",
        type: "string"
      },
      {
        name: "deleted_at",
        type: "string",
        isOptional: true
      },
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
    }),
    tableSchema({
      name: Table.sharedWith.name,
      columns: Table.sharedWith.columns
    })
  ]
});
