import { t } from "elysia";

// import { noteCategory } from "@/db/schema/note";

// const StringEnum = <T extends Readonly<string[]>>(values: T) =>
//   t.Unsafe<T[number]>({
//     type: "string",
//     enum: values
//   });

export const noteSchema = t.Object({
  id: t.String(),
  text: t.String(),
  category: t.Optional(t.String()),
  is_complete: t.Optional(t.Boolean()),
  created_at: t
    .Transform(t.Numeric())
    .Decode((v) => new Date(v))
    .Encode((v) => v.getTime()),
  updated_at: t
    .Transform(t.Numeric())
    .Decode((v) => new Date(v))
    .Encode((v) => v.getTime()),
  deleted_at: t.Optional(
    t.Nullable(
      t
        .Transform(t.Numeric())
        .Decode((v) => new Date(v))
        .Encode((v) => v.getTime())
    )
  ),
  user_id: t.Numeric()
});

export type NoteSchema = typeof noteSchema.static;

export const sharedWithSchema = t.Object({
  note_id: t.String(),
  user_email: t.String({ format: "email" }),
  created_at: t
    .Transform(t.Numeric())
    .Decode((v) => new Date(v))
    .Encode((v) => v.getTime()),
  updated_at: t
    .Transform(t.Numeric())
    .Decode((v) => new Date(v))
    .Encode((v) => v.getTime()),
  deleted_at: t.Optional(
    t.Nullable(
      t
        .Transform(t.Numeric())
        .Decode((v) => new Date(v))
        .Encode((v) => v.getTime())
    )
  )
});

export type SharedWithSchema = typeof sharedWithSchema.static;

export const changesSchema = t.Record(
  t.String(),
  t.Object({
    created: t.Array(t.Record(t.String(), t.Any())),
    updated: t.Array(t.Record(t.String(), t.Any())),
    deleted: t.Array(t.String())
  })
);

export type ChangesSchema = typeof changesSchema.static;

export const pushChangesBodySchema = changesSchema;
export type PushChangesBodySchema = typeof pushChangesBodySchema.static;

export const pushChangesQuerySchema = t.Object({
  last_pulled_at: t.Numeric()
});

export type PushChangesQuerySchema = typeof pushChangesQuerySchema.static;

export const pullChangesQuerySchema = t.Object({
  last_pulled_at: t.Optional(t.Numeric()),
  schema_version: t.Numeric(),
  migration: t.Optional(
    t.Nullable(
      t.Object({
        from: t.Numeric(),
        tables: t.Array(t.String()),
        columns: t.Array(
          t.Object({
            table: t.String(),
            columns: t.Array(t.String())
          })
        )
      })
    )
  )
});

export type PullChangesQuerySchema = typeof pullChangesQuerySchema.static;

export const pullChangesBodySchema = t.Record(t.String(), t.Array(t.String()));

export type PullChangesBodySchema = typeof pullChangesBodySchema.static;
