import React from "react";
import { Button } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { NotesController } from "@/lib/db/controllers/note";
import { toast } from "@/lib/toast";

type SeedButtonProps = { userId: number };

export function SeedButton({ userId }: SeedButtonProps) {
  const navigation = useNavigation();
  const [isPending, setIsLoading] = React.useState(false);

  async function seedDB() {
    setIsLoading(true);
    try {
      await NotesController.seed(userId);
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("Root", { screen: "Home" });
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
