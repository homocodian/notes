import { object, picklist, string } from "valibot";

export const noteSchema = object({
  text: string("Text must be string"),
  category: picklist(
    ["general", "important"],
    "Category must be either general or important",
  ),
});
