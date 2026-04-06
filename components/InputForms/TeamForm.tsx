import { View } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, TextInput, Button, Chip, Snackbar } from "../ui";
import Typeahead from "../Typeahead";
import { getData, postData, updateData } from "../../utils/backendData";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<Record<string, any>[]>([]);

  const [teamData, setTeamData] = useState<Record<string, any>[]>([]);
  const [athleteData, setAthleteData] = useState<Record<string, any>[]>([]);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function fetchTeams() {
      try {
        setTeamData(await getData("Teams"));
      } catch {}
    }
    async function fetchAthletes() {
      setAthleteLoading(true);
      try {
        setAthleteData(await getData("Athletes"));
      } catch {
      } finally {
        setAthleteLoading(false);
      }
    }
    fetchTeams();
    fetchAthletes();
  }, []);

  function handleNameChange(text: string) {
    setName(text);
    if (text.trim()) {
      const duplicate = teamData.some(
        (t) => t.Name.toLowerCase() === text.trim().toLowerCase(),
      );
      setNameError(duplicate ? "Group already exists" : "");
    } else {
      setNameError("");
    }
  }

  function handleMemberSelect(item: Record<string, any>) {
    if (!members.some((m) => m.id === item.id)) {
      setMembers((prev) => [...prev, item]);
    }
    setMemberInput("");
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function resetForm() {
    setName("");
    setMemberInput("");
    setMembers([]);
    setNameError("");
  }

  async function handleSubmit() {
    setNameError("");

    if (!name.trim()) {
      setNameError("Group name is required");
      return;
    }

    const duplicate = teamData.some(
      (t) => t.Name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (duplicate) {
      setNameError("Group already exists");
      return;
    }

    setSubmitLoading(true);
    try {
      const teamResult = await postData("Teams", { Name: name.trim() });
      const teamId = teamResult[0]?.id;

      for (const member of members) {
        await updateData("Athletes", member.id, { "Team ID": teamId });
      }

      setSnackbarMessage(`Successfully added new group ${name.trim()}`);
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
      <View className="p-3 gap-1">
        <Text variant="headline" className="text-center mt-4 mb-2">
          New Group
        </Text>

        <TextInput
          label="Group Name"
          placeholder="Enter group name"
          value={name}
          onChangeText={handleNameChange}
          error={!!nameError}
          errorMessage={nameError}
        />

        <Typeahead
          array={athleteData}
          propertyName="Name"
          formTitle="Add Members"
          placeholderText="Search for swimmers"
          loading={athleteLoading}
          value={memberInput}
          allowsNew={false}
          showOnEmpty={false}
          onChangeText={setMemberInput}
          onSelect={handleMemberSelect}
        />
        {members.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 my-1.5">
            {members.map((m) => (
              <Chip
                key={m.id}
                label={m.Name}
                onClose={() => removeMember(m.id)}
              />
            ))}
          </View>
        )}

        <Button
          onPress={handleSubmit}
          disabled={submitLoading || !!nameError}
          loading={submitLoading}
          icon={<Ionicons name="people-outline" size={18} color="#fff" />}
        >
          Add Group
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
