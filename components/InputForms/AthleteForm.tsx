import { StyleSheet, View } from "react-native";
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

  async function fetchAthletes() {
    try {
      setAthleteData(await getData("Athletes"));
    } catch (e: any) {
      setNameError("Failed to load athletes");
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

  // Fetch athletes and teams on mount
  useEffect(() => {
    fetchAthletes();
    fetchTeams();
  }, []);

  // Fetch groups filtered by selected team
  useEffect(() => {
    if (teamId === null) {
      setGroupData([]);
      return;
    }

    async function fetchGroups() {
      setGroupLoading(true);
      try {
        setGroupData(await getData("Groups", { "Team ID": teamId }));
      } catch (e: any) {
        setGroupError("Failed to load groups");
      } finally {
        setGroupLoading(false);
      }
    }

    fetchGroups();
  }, [teamId]);

  function handleNameChange(text: string) {
    setName(text);
    // Check for duplicate against loaded athlete data
    if (text.trim()) {
      const duplicate = athleteData.some((a) => a.Name === text.trim());
      setNameError(duplicate ? "Name already exists" : "");
    } else {
      setNameError("");
    }
  }

  function handleTeamSelect(item: Record<string, any>) {
    setTeamName(item.Name);
    setTeamId(item.id);
    // Clear group when team changes
    setGroupId(null);
    setGroupName("");
  }

  function handleTeamTextChange(text: string) {
    setTeamName(text);
    // Clear team ID if user is typing a new value
    setTeamId(null);
    // Clear group when team is cleared
    if (!text.trim()) {
      setGroupId(null);
      setGroupName("");
    }
  }

  function resetForm() {
    setName("");
    setAge("");
    setTeamId(null);
    setTeamName("");
    setGroupId(null);
    setGroupName("");
    setNameError("");
    setAgeError("");
    setTeamError("");
    setGroupError("");
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
    } else {
      const duplicate = athleteData.some((a) => a.Name === name.trim());
      if (duplicate) {
        setNameError("Name already exists");
        hasError = true;
      }
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

    setSubmitLoading(true);
    try {
      const successMessages: string[] = [];

      // Create new team if user typed a new name
      let resolvedTeamId = teamId;
      if (resolvedTeamId === null && teamName.trim()) {
        const teamResult = await postData("Teams", { Name: teamName.trim() });
        resolvedTeamId = teamResult[0]?.id;
        successMessages.push(`Added new Team ${teamName.trim()}`);
      }

      // Create new group if user typed a new name
      let resolvedGroupId = groupId;
      if (resolvedGroupId === null && groupName.trim()) {
        const groupPayload: Record<string, any> = { Name: groupName.trim() };
        if (resolvedTeamId !== null) groupPayload["Team ID"] = resolvedTeamId;
        const groupResult = await postData("Groups", groupPayload);
        resolvedGroupId = groupResult[0]?.id;
        successMessages.push(`Added new Group ${groupName.trim()}`);
      }

      if (resolvedTeamId !== null) athlete["Team ID"] = resolvedTeamId;
      if (resolvedGroupId !== null) athlete["Group ID"] = resolvedGroupId;

      await postData("Athletes", athlete);
      successMessages.push(`Added New Athlete ${name.trim()}`);

      for (const msg of successMessages) {
        console.log(msg);
      }
      setSnackbarMessage(successMessages.join("\n"));
      setSnackbarVisible(true);
      resetForm();
      fetchAthletes();
      fetchTeams();
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

  const showGroup = teamName.trim().length > 0;

  return (
    <>
        <View style={styles.container} accessibilityRole={"form" as any}>
          <Title>New Swimmer</Title>

          <ThemedInput
            formTitle="Athlete Name"
            placeholder="Enter athlete name"
            value={name}
            onChangeText={handleNameChange}
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
            placeholderText="Select or create team (optional)"
            loading={teamLoading}
            value={teamName}
            allowsNew
            showOnEmpty
            onChangeText={handleTeamTextChange}
            onSelect={handleTeamSelect}
          />
          <HelperText type="error" visible={!!teamError}>
            {teamError}
          </HelperText>

          {showGroup && (
            <>
              <Typeahead
                array={groupData}
                propertyName="Name"
                formTitle="Group"
                placeholderText="Select or create group (optional)"
                loading={groupLoading}
                value={groupName}
                allowsNew
                showOnEmpty
                onChangeText={(text) => {
                  setGroupName(text);
                  setGroupId(null);
                }}
                onSelect={(item) => {
                  setGroupName(item.Name);
                  setGroupId(item.id);
                }}
              />
              <HelperText type="error" visible={!!groupError}>
                {groupError}
              </HelperText>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={submitLoading || !!nameError}
            loading={submitLoading}
            icon="account-plus"
          >
            Add Athlete
          </Button>
        </View>

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
