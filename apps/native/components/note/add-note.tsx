import React from "react";
import { FAB } from "react-native-paper";

import { useAuth } from "@/context/auth";
import { NotesController } from "@/lib/db/controllers/note";
import { toast } from "@/lib/toast";

export function AddNote() {
  const { user } = useAuth();
  return (
    <FAB
      icon="plus"
      className="absolute m-4 right-0 bottom-0"
      onPress={async () => {
        if (!user?.id) {
          toast("Login please");
          return;
        }
        await NotesController.save(
          `Hello there ${Math.round(Math.random() * 100)}!`,
          "general",
          user.id
        );
      }}
    />
  );
}
