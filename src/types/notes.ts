type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type Note = {
  id: string;
  text: string;
  category: "general" | "important";
  timestamp: Timestamp;
  updatedAt: Timestamp;
  name?: string;
  email?: string;
  userId: string;
  sharedWith?: Array<string>;
  isComplete: boolean;
};

export interface INoteCard extends Note {
  isComplete: boolean;
  isShared: boolean;
  label?: string;
  disableActions?: boolean;
}
