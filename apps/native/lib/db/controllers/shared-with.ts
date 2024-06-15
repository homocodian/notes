import { Q } from "@nozbe/watermelondb";

import { database } from "..";
import { Table } from "../model/schema";
import { SharedWithNote } from "../model/shared-with";

export const sharedWith = database.collections.get<SharedWithNote>(
  Table.sharedWith.name
);

export class SharedNotesNoteController {
  static async save({
    noteId,
    userEmails
  }: {
    noteId: string;
    userEmails: string[];
  }) {
    return await database.write(async () => {
      const sharedWithNote = await sharedWith
        .query(
          Q.where("deleted_at", null),
          Q.where("note_id", noteId),
          Q.where("user_email", Q.oneOf(userEmails))
        )
        .fetch();

      const emailsToAdd: string[] = [];
      const emailsToIgnore: string[] = [];

      if (sharedWithNote.length > 0) {
        userEmails.forEach((email) => {
          const isShared = sharedWithNote.find(
            (sharedWithNote) => sharedWithNote.userEmail === email
          );
          if (isShared) emailsToIgnore.push(email);
          else emailsToAdd.push(email);
        });
      } else {
        emailsToAdd.push(...userEmails);
      }

      if (emailsToAdd.length <= 0) {
        return { emailsAlreadySharedWith: emailsToIgnore };
      }

      await sharedWith.database.batch(
        emailsToAdd.map((email) =>
          sharedWith.prepareCreate((shareNote) => {
            shareNote.noteId = noteId;
            shareNote.userEmail = email;
            shareNote.status = "pending";
          })
        )
      );

      return { emailsAlreadySharedWith: emailsToIgnore };
    });
  }

  static async delete(id: string) {
    await database.write(async () => {
      const sharedWithNote = await sharedWith.find(id);
      sharedWithNote.update((sharedWithNote) => {
        sharedWithNote.deletedAt = new Date().toISOString();
      });
    });
  }

  static async undo(id: string) {
    await database.write(async () => {
      const sharedWithNote = await sharedWith.find(id);
      sharedWithNote.update((sharedWithNote) => {
        sharedWithNote.deletedAt = null;
      });
    });
  }
}
