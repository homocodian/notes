import { database } from "..";
import Note from "../model/note";
import { Table } from "../model/schema";

export const notes = database.collections.get<Note>(Table.note.name);

const categories = ["general", "important"] as const;

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
      });
    });
  }

  static async delete(id: string) {
    await database.write(async () => {
      const note = await notes.find(id);
      note.update((note) => {
        const date = new Date().toISOString();
        (note.deletedAt as unknown as string) = date;
      });
    });
  }

  static async undo(id: string) {
    await database.write(async () => {
      const note = await notes.find(id);
      note.update((note) => {
        note.deletedAt = null;
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

  static async seed(userId: number) {
    await database.write(async () => {
      await notes.database.batch(
        notes.prepareCreate((note) => {
          note.text = "This is a note 1";
          note.category = categories[Math.round(Math.random())];
          note.userId = userId;
          note.isComplete = !!Math.round(Math.random());
        }),
        notes.prepareCreate((note) => {
          note.text = "This is a note 2";
          note.category = categories[Math.round(Math.random())];
          note.userId = userId;
          note.isComplete = !!Math.round(Math.random());
        }),
        notes.prepareCreate((note) => {
          note.text = "This is a note 3";
          note.category = categories[Math.round(Math.random())];
          note.userId = userId;
          note.isComplete = !!Math.round(Math.random());
        }),
        notes.prepareCreate((note) => {
          note.text = "This is a note 4";
          note.category = categories[Math.round(Math.random())];
          note.userId = userId;
          note.isComplete = !!Math.round(Math.random());
        })
      );
    });
  }
}
