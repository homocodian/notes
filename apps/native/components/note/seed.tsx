import React from "react";
import { Button } from "react-native-paper";

import { router } from "expo-router";

import { NotesController } from "@/lib/db/controllers/note";
import { toast } from "@/lib/toast";

type SeedButtonProps = { userId: number };

export function SeedButton({ userId }: SeedButtonProps) {
  const [isPending, setIsLoading] = React.useState(false);

  async function seedDB() {
    setIsLoading(true);
    try {
      await NotesController.seed(userId);
      if (router.canGoBack()) router.back();
      else router.push("/");
    } catch (error) {
      toast("Failed to seed database");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onPress={seedDB} loading={isPending}>
      Seed
    </Button>
  );
}
