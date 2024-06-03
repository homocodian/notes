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

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
