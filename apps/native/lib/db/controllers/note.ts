import { database } from "..";
import Note from "../model/note";
import { Table } from "../model/schema";

export const notes = database.collections.get<Note>(Table.note.name);

export class NotesController {
  static async save({
    text,
    category,
    userId,
    isCompleted
  }: {
    text: string;
    category: string;
    userId: number;
    isCompleted?: boolean;
  }) {
    await database.write(async () => {
      await notes.create((note) => {
        note.text = text;
        note.category = category;
        note.userId = userId;
        note.isComplete = isCompleted ?? false;
        note.deleted = false;
      });
    });
  }

  static async delete(id: string) {
    await database.write(async () => {
      await (
        await notes.find(id)
      ).update((note) => {
        note.deleted = true;
      });
    });
  }

  static async undo(id: string) {
    await database.write(async () => {
      await (
        await notes.find(id)
      ).update((note) => {
        note.deleted = false;
      });
    });
  }

  static async edit({
    id,
    text,
    category,
    isComplete
  }: {
    id: string;
    text?: string;
    category?: string;
    isComplete?: boolean;
  }) {
    await database.write(async () => {
      await (
        await notes.find(id)
      ).update((note) => {
        if (!note) {
          return;
        }
        if (text !== undefined) {
          note.text = text;
        }
        if (category !== undefined) {
          note.category = category;
        }
        if (isComplete !== undefined) {
          note.isComplete = isComplete;
        }
      });
    });
  }
}
