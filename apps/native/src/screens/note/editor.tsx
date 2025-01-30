import React from "react";
import { View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useShallow } from "zustand/react/shallow";

import { SeedButton } from "@/components/note/seed";
import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { NoteFormProvider, useNoteFormStore } from "@/context/note-form";
import { NotesController } from "@/lib/db/controllers/note";
import { toast } from "@/lib/toast";
import { RootStackScreenProps } from "@/types/navigation";

export default function NoteEditor({
  navigation,
  route
}: RootStackScreenProps<"Editor">) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
          paddingVertical: SCREEN_VERTICAL_PADDING,
          gap: 20
        }}
        className="flex-1 flex-col flex"
      >
        <NoteFormProvider
          initialState={{
            text: route.params?.text ?? "",
            category: route.params?.category ?? null
          }}
        >
          <View className="flex flex-row justify-between items-center">
            <View>
              <IconButton icon="arrow-left" onPress={navigation.goBack} />
            </View>
            <View className="flex flex-row">
              {__DEV__ ? <SeedButton userId={user!.id} /> : null}
              <SaveButton noteId={route.params?.noteId} />
            </View>
          </View>
          <NoteForm />
        </NoteFormProvider>
      </View>
    </SafeAreaView>
  );
}

function NoteForm() {
  const theme = useAppTheme();
  const [showDropDown, setShowDropDown] = React.useState(false);

  const [category, setCategory] = useNoteFormStore(
    useShallow((state) => [state.category, state.setCategory])
  );

  const [text, setText] = useNoteFormStore(
    useShallow((state) => [state.text, state.setText])
  );

  return (
    <>
      <DropDown
        placeholder="Category"
        mode="flat"
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={category}
        setValue={setCategory}
        list={[
          { label: "General", value: "general" },
          { label: "Important", value: "important" }
        ]}
        theme={theme}
        dropDownItemTextStyle={{ color: theme.colors.onSurface }}
        inputProps={{
          right: (
            <TextInput.Icon
              icon={(props) => (
                <MaterialIcons name="arrow-drop-down" {...props} />
              )}
            />
          ),
          style: {
            backgroundColor: "transparent"
          },
          underlineStyle: { display: "none" }
        }}
      />
      <View className="flex-1">
        <TextInput
          placeholder="Note"
          className="text-lg flex-1"
          style={{
            textAlignVertical: "top",
            backgroundColor: "transparent"
          }}
          multiline
          underlineStyle={{ display: "none" }}
          value={text}
          onChangeText={setText}
          autoFocus
        />
      </View>
    </>
  );
}

function SaveButton({ noteId }: { noteId?: string }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const text = useNoteFormStore((state) => state.text);
  const category = useNoteFormStore((state) => state.category);

  const shouldEdit =
    noteId && typeof noteId !== "undefined" && typeof noteId === "string";

  const editSave = React.useCallback(async () => {
    if (!category) return toast("Please choose the category");
    if (!text) return toast("Please fill the note");
    if (!user?.id) return toast("Please login");

    setIsLoading(true);
    try {
      if (shouldEdit) {
        await NotesController.edit({ id: noteId, text, category });
        toast("Edited");
      } else {
        await NotesController.save({ text, category, userId: user.id });
        toast("Saved");
      }
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("Root", { screen: "Home" });
    } catch (error) {
      toast(shouldEdit ? "Failed to edit" : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  }, [user, shouldEdit, text, category]);

  return (
    <Button
      mode="contained"
      onPress={editSave}
      loading={isLoading}
      disabled={isLoading}
    >
      {shouldEdit ? "Edit" : "Save"}
    </Button>
  );
}
