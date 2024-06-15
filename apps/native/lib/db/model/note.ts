import { Model, Q } from "@nozbe/watermelondb";
import {
  date,
  field,
  lazy,
  nochange,
  readonly,
  text
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

import { Table } from "./schema";

export default class Note extends Model {
  static table = Table.note.name;

  static associations: Associations = {
    [Table.sharedWith.name]: { type: "has_many", foreignKey: "note_id" }
  };

  @text("text") text!: string;
  @text("category") category!: string;
  @field("is_complete") isComplete!: boolean;
  @nochange @field("user_id") userId!: number;

  @field("deleted_at") deletedAt!: string | null;

  @readonly @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;

  @lazy sharedWith = this.collections
    .get(Table.sharedWith.name)
    .query(Q.and(Q.where("note_id", this.id), Q.where("deleted_at", null)));
}
