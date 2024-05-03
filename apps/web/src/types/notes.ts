export type Note = {
  id: string;
  text: string;
  category: "general" | "important";
  createdAt: string;
  updatedAt: string;
  name?: string;
  email?: string;
  userId: number;
  sharedNotes?: Array<SharedNote>;
  isComplete: boolean;
};

export type SharedNote = {
  userId: number;
  noteId: number;
  user: Readonly<{
    id: number;
    email: string;
  }>;
};

export interface INoteCard extends Note {
  isComplete: boolean;
  disableActions?: boolean;
}
