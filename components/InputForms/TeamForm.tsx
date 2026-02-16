import { StyleSheet, View, Pressable, Keyboard, Platform } from "react-native";
import React, { useState } from "react";
import { HelperText, Snackbar } from "react-native-paper";

import Title from "../Title";
import ThemedInput from "../ThemedInput";
import Button from "../Button";
import { postData } from "../../utils/backendData";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function resetForm() {
    setName("");
  }

  async function handleSubmit() {
    setNameError("");

    if (!name.trim()) {
      setNameError("Team name is required");
      return;
    }

    setSubmitLoading(true);
    try {
      await postData("Teams", { Name: name.trim() });
      setSnackbarMessage(`Successfully added ${name.trim()}`);
      setSnackbarVisible(true);
      resetForm();
    } catch (e: any) {
      setNameError(e.message ?? "An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <Pressable
        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
        accessible={false}
      >
        <View style={styles.container}>
          <Title>New Team</Title>

          <ThemedInput
            formTitle="Team Name"
            placeholder="Enter team name"
            value={name}
            onChangeText={setName}
          />
          <HelperText type="error" visible={!!nameError}>
            {nameError}
          </HelperText>

          <Button
            onClick={handleSubmit}
            disabled={submitLoading}
            loading={submitLoading}
            icon="account-multiple-plus"
          >
            Add Team
          </Button>
        </View>
      </Pressable>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 4,
  },
});
