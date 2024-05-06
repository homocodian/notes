export type Note = {
  id: number;
  text: string;
  category: "general" | "important";
  createdAt: string;
  updatedAt: string;
  name?: string;
  email?: string;
  userId: number;
  sharedWith?: Array<SharedWith> | null;
  isComplete: boolean;
};

export type SharedWith = {
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
