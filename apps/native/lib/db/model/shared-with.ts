import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  immutableRelation,
  readonly
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import Note from "./note";
import { Table } from "./schema";

export type SharedNoteStatus = "pending" | "accepted" | "rejected";

export class SharedWithNote extends Model {
  static table = Table.sharedWith.name;

  static associations: Associations = {
    [Table.note.name]: { type: "belongs_to", key: "note_id" }
  };

  @immutableRelation("notes", "note_id") note!: Note;

  @field("note_id") noteId!: string;

  @field("user_email") userEmail!: string;

  @field("status") status!: SharedNoteStatus;

  @field("deleted_at") deletedAt!: string | null;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
