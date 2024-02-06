import {
  Output,
  array,
  boolean,
  merge,
  object,
  partial,
  picklist,
  string,
} from "valibot";

export const noteSchema = object({
  text: string("Text must be string"),
  category: picklist(
    ["general", "important"],
    "Category must be either general or important",
  ),
});

export const noteToUpdateSchema = partial(
  merge([
    noteSchema,
    object({
      isComplete: boolean(),
      removeSharedWith: array(
        string("field 'RemovedSharedWith' value must be of string"),
        "'RemovedSharedWith' must be array",
      ),
      sharedWith: array(
        string("field 'sharedWith' value must be of string"),
        "field 'sharedWith' must be array of string",
      ),
      fieldToDelete: picklist(
        ["sharedWith"],
        "Only sharedWith field is allowed to delete",
      ),
    }),
  ]),
);

export type NoteToUpdate = Output<typeof noteToUpdateSchema>;
