import { database } from "..";
import Note from "../model/note";
import { Table } from "../model/schema";

export const notes = database.collections.get<Note>(Table.note.name);

export class NotesController {
  static async save(
    text: string,
    category: string,
    userId: number,
    isCompleted?: boolean
  ) {
    await database.write(async () => {
      await notes.create((note) => {
        note.text = text;
        note.category = category;
        note.userId = userId;
        note.isComplete = isCompleted ?? false;
      });
    });
  }

  static async destroy(id: string) {
    await database.write(async () => {
      await (await notes.find(id)).destroyPermanently();
    });
  }

  static async delete(id: string) {
    await database.write(async () => {
      await (await notes.find(id)).markAsDeleted();
    });
  }
}
