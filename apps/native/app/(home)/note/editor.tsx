import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useShallow } from "zustand/react/shallow";

import {
  SCREEN_HORIZONTAL_PADDING,
  SCREEN_VERTICAL_PADDING
} from "@/constant/screens";
import { useAuth } from "@/context/auth";
import { useAppTheme } from "@/context/material-3-theme-provider";
import { NotesController } from "@/lib/db/controllers/note";
import { useNoteFormStore } from "@/lib/store/note";
import { toast } from "@/lib/toast";

export default function NoteEditor() {
  React.useEffect(() => {
    return () => useNoteFormStore.setState({ text: "", category: null });
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
        paddingVertical: SCREEN_VERTICAL_PADDING,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        flex: 1
      }}
      className="pt-6"
    >
      <View className="flex flex-row justify-between items-center my-4">
        <View>
          <IconButton icon="close" onPress={router.back} />
        </View>
        <View>
          <SaveButton />
        </View>
      </View>
      <NoteForm />
    </View>
  );
}

function NoteForm() {
  const theme = useAppTheme();
  const [showDropDown, setShowDropDown] = React.useState(false);
  const { category: initCategory } = useLocalSearchParams<{
    category?: string;
  }>();

  const [category, setCategory] = useNoteFormStore(
    useShallow((state) => [state.category, state.setCategory])
  );

  const [text, setText] = useNoteFormStore(
    useShallow((state) => [state.text, state.setText])
  );

  useEffect(() => {
    initCategory && setCategory(initCategory);
  }, [initCategory]);

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

function SaveButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const { edit } = useLocalSearchParams<{
    edit?: string;
  }>();

  const shouldEdit =
    edit && typeof edit !== "undefined" && typeof edit === "string";

  const editSave = React.useCallback(async () => {
    const { text, category } = useNoteFormStore.getState();

    if (!category) return toast("Please choose the category");
    if (!text) return toast("Please fill the note");
    if (!user?.id) return toast("Please login");

    setIsLoading(true);
    try {
      if (shouldEdit) {
        await NotesController.edit({ id: edit, text, category });
      } else {
        await NotesController.save({ text, category, userId: user.id });
      }
      if (router.canGoBack()) router.back();
      else router.push("/");
    } catch (error) {
      toast(shouldEdit ? "Failed to edit" : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  }, [user, shouldEdit]);

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
