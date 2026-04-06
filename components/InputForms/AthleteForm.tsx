import { View } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, TextInput, Button, Snackbar } from "../ui";
import Typeahead from "../Typeahead";

import { getData, postData } from "../../utils/backendData";

export default function AthleteForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");

  const [athleteData, setAthleteData] = useState<Record<string, any>[]>([]);
  const [teamData, setTeamData] = useState<Record<string, any>[]>([]);

  const [teamLoading, setTeamLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [teamError, setTeamError] = useState("");

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
      setTeamError("Failed to load groups");
    } finally {
      setTeamLoading(false);
    }
  }

  useEffect(() => {
    fetchAthletes();
    fetchTeams();
  }, []);

  function handleNameChange(text: string) {
    setName(text);
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
  }

  function handleTeamTextChange(text: string) {
    setTeamName(text);
    setTeamId(null);
  }

  function resetForm() {
    setName("");
    setAge("");
    setTeamId(null);
    setTeamName("");
    setNameError("");
    setAgeError("");
    setTeamError("");
  }

  async function handleSubmit() {
    setNameError("");
    setAgeError("");
    setTeamError("");

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

      let resolvedTeamId = teamId;
      if (resolvedTeamId === null && teamName.trim()) {
        const teamResult = await postData("Teams", { Name: teamName.trim() });
        resolvedTeamId = teamResult[0]?.id;
        successMessages.push(`Added new Group ${teamName.trim()}`);
      }

      if (resolvedTeamId !== null) athlete["Team ID"] = resolvedTeamId;

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

      if (msgLower.includes("name")) setNameError(msg);
      else if (msgLower.includes("age")) setAgeError(msg);
      else if (msgLower.includes("team") || msgLower.includes("group"))
        setTeamError(msg);
      else setNameError(msg);
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <View className="p-3 gap-1" accessibilityRole={"form" as any}>
        <Text variant="headline" className="text-center mt-4 mb-2">
          New Swimmer
        </Text>

        <TextInput
          label="Athlete Name"
          placeholder="Enter athlete name"
          value={name}
          onChangeText={handleNameChange}
          error={!!nameError}
          errorMessage={nameError}
        />

        <TextInput
          label="Age"
          placeholder="Enter age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          error={!!ageError}
          errorMessage={ageError}
        />

        <Typeahead
          array={teamData}
          propertyName="Name"
          formTitle="Group"
          placeholderText="Select or create group (optional)"
          loading={teamLoading}
          value={teamName}
          allowsNew
          showOnEmpty
          onChangeText={handleTeamTextChange}
          onSelect={handleTeamSelect}
        />
        {!!teamError && (
          <Text variant="body-sm" className="text-danger ml-1">
            {teamError}
          </Text>
        )}

        <Button
          onPress={handleSubmit}
          disabled={submitLoading || !!nameError}
          loading={submitLoading}
          icon={<Ionicons name="person-add-outline" size={18} color="#fff" />}
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
