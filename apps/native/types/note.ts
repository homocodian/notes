export type Note = {
  id: string;
  text: string;
  category: "general" | "important";
  createdAt: string;
  updatedAt: string;
  // name?: string;
  // email?: string;
  userId: number;
  // sharedWith?: SharedWith[] | null;
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
