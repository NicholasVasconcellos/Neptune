import { StyleSheet, View, Pressable, Keyboard, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { HelperText, Snackbar } from "react-native-paper";

import Title from "../Title";
import Typeahead from "../Typeahead";
import ThemedInput from "../ThemedInput";
import Button from "../Button";

import { getData, postData } from "../../utils/backendData";

export default function AthleteForm() {
  // Field values
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupName, setGroupName] = useState("");

  // Typeahead data arrays
  const [athleteData, setAthleteData] = useState<Record<string, any>[]>([]);
  const [teamData, setTeamData] = useState<Record<string, any>[]>([]);
  const [groupData, setGroupData] = useState<Record<string, any>[]>([]);

  // Loading states
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Per-field errors
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [teamError, setTeamError] = useState("");
  const [groupError, setGroupError] = useState("");

  // Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch typeahead data on mount
  useEffect(() => {
    async function fetchAthletes() {
      setAthleteLoading(true);
      try {
        setAthleteData(await getData("Athletes"));
      } catch (e: any) {
        setNameError("Failed to load athletes");
      } finally {
        setAthleteLoading(false);
      }
    }

    async function fetchTeams() {
      setTeamLoading(true);
      try {
        setTeamData(await getData("Teams"));
      } catch (e: any) {
        setTeamError("Failed to load teams");
      } finally {
        setTeamLoading(false);
      }
    }

    async function fetchGroups() {
      setGroupLoading(true);
      try {
        setGroupData(await getData("Groups"));
      } catch (e: any) {
        setGroupError("Failed to load groups");
      } finally {
        setGroupLoading(false);
      }
    }

    fetchAthletes();
    fetchTeams();
    fetchGroups();
  }, []);

  function resetForm() {
    setName("");
    setAge("");
    setTeamId(null);
    setTeamName("");
    setGroupId(null);
    setGroupName("");
  }

  async function handleSubmit() {
    // Clear errors
    setNameError("");
    setAgeError("");
    setTeamError("");
    setGroupError("");

    // Client-side validation
    let hasError = false;

    if (!name.trim()) {
      setNameError("Name is required");
      hasError = true;
    }

    if (!age.trim()) {
      setAgeError("Age is required");
      hasError = true;
    } else if (isNaN(Number(age)) || Number(age) < 0) {
      setAgeError("Age must be a valid number");
      hasError = true;
    }

    if (hasError) return;

    const athlete: Record<string, any> = {
      Name: name.trim(),
      Age: Number(age),
    };

    if (teamId !== null) athlete.Team = teamId;
    if (groupId !== null) athlete.Group = groupId;

    setSubmitLoading(true);
    try {
      await postData("Athletes", athlete);
      setSnackbarMessage(`Successfully added ${name.trim()}`);
      setSnackbarVisible(true);
      resetForm();
    } catch (e: any) {
      const msg = e.message ?? "An error occurred";
      const msgLower = msg.toLowerCase();

      if (msgLower.includes("name")) {
        setNameError(msg);
      } else if (msgLower.includes("age")) {
        setAgeError(msg);
      } else if (msgLower.includes("team")) {
        setTeamError(msg);
      } else if (msgLower.includes("group")) {
        setGroupError(msg);
      } else {
        setNameError(msg);
      }
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
        <View style={styles.container} accessibilityRole={"form" as any}>
          <Title>New Swimmer</Title>

          <Typeahead
            array={athleteData}
            propertyName="Name"
            formTitle="Athlete Name"
            placeholderText="Enter athlete name"
            loading={athleteLoading}
            value={name}
            onChangeText={setName}
            onSelect={(item) => setName(item.Name)}
          />
          <HelperText type="error" visible={!!nameError}>
            {nameError}
          </HelperText>

          <ThemedInput
            formTitle="Age"
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
          <HelperText type="error" visible={!!ageError}>
            {ageError}
          </HelperText>

          <Typeahead
            array={teamData}
            propertyName="Name"
            formTitle="Team"
            placeholderText="Select team (optional)"
            loading={teamLoading}
            value={teamName}
            onSelect={(item) => {
              setTeamName(item.Name);
              setTeamId(item.id);
            }}
          />
          <HelperText type="error" visible={!!teamError}>
            {teamError}
          </HelperText>

          <Typeahead
            array={groupData}
            propertyName="Name"
            formTitle="Group"
            placeholderText="Select group (optional)"
            loading={groupLoading}
            value={groupName}
            onSelect={(item) => {
              setGroupName(item.Name);
              setGroupId(item.id);
            }}
          />
          <HelperText type="error" visible={!!groupError}>
            {groupError}
          </HelperText>

          <Button
            onClick={handleSubmit}
            disabled={submitLoading}
            loading={submitLoading}
            icon="account-plus"
          >
            Add Athlete
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
