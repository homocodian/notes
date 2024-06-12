import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  nochange,
  readonly,
  text
} from "@nozbe/watermelondb/decorators";

import { Table } from "./schema";

export default class Note extends Model {
  static table = Table.note.name;

  @text("text") text!: string;
  @text("category") category!: string;
  @field("is_complete") isComplete!: boolean;
  @nochange @field("user_id") userId!: number;

  @field("deleted_at") deletedAt!: string | null;

  @readonly @date("created_at") createdAt!: Date;
  @date("updated_at") updatedAt!: Date;
}
