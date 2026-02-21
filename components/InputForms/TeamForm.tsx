import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { HelperText, Snackbar, Chip } from "react-native-paper";

import Title from "../Title";
import ThemedInput from "../ThemedInput";
import Typeahead from "../Typeahead";
import Button from "../Button";
import { getData, postData, updateData } from "../../utils/backendData";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<Record<string, any>[]>([]);
  const [subGroupInput, setSubGroupInput] = useState("");
  const [subGroups, setSubGroups] = useState<string[]>([]);

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
        (t) => t.Name.toLowerCase() === text.trim().toLowerCase()
      );
      setNameError(duplicate ? "Team already exists" : "");
    } else {
      setNameError("");
    }
  }

  function handleMemberSelect(item: Record<string, any>) {
    // Avoid adding duplicates
    if (!members.some((m) => m.id === item.id)) {
      setMembers((prev) => [...prev, item]);
    }
    setMemberInput("");
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleAddSubGroup() {
    const trimmed = subGroupInput.trim();
    if (
      trimmed &&
      !subGroups.some((g) => g.toLowerCase() === trimmed.toLowerCase())
    ) {
      setSubGroups((prev) => [...prev, trimmed]);
    }
    setSubGroupInput("");
  }

  function removeSubGroup(groupName: string) {
    setSubGroups((prev) => prev.filter((g) => g !== groupName));
  }

  function resetForm() {
    setName("");
    setMemberInput("");
    setMembers([]);
    setSubGroupInput("");
    setSubGroups([]);
    setNameError("");
  }

  async function handleSubmit() {
    setNameError("");

    if (!name.trim()) {
      setNameError("Team name is required");
      return;
    }

    const duplicate = teamData.some(
      (t) => t.Name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      setNameError("Team already exists");
      return;
    }

    setSubmitLoading(true);
    try {
      const successMessages: string[] = [];

      // Create the team
      const teamResult = await postData("Teams", { Name: name.trim() });
      const teamId = teamResult[0]?.id;
      successMessages.push(`Successfully added new team ${name.trim()}`);

      // Create sub groups if any
      for (const group of subGroups) {
        await postData("Groups", { Name: group, "Team ID": teamId });
        successMessages.push(`Successfully added new group ${group}`);
      }

      // Update members to belong to this team
      for (const member of members) {
        await updateData("Athletes", member.id, { "Team ID": teamId });
      }

      for (const msg of successMessages) {
        console.log(msg);
      }
      setSnackbarMessage(successMessages.join("\n"));
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
        <View style={styles.container}>
          <Title>New Team</Title>

          <ThemedInput
            formTitle="Team Name"
            placeholder="Enter team name"
            value={name}
            onChangeText={handleNameChange}
          />
          <HelperText type="error" visible={!!nameError}>
            {nameError}
          </HelperText>

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
            <View style={styles.chipRow}>
              {members.map((m) => (
                <Chip
                  key={m.id}
                  onClose={() => removeMember(m.id)}
                  style={styles.chip}
                >
                  {m.Name}
                </Chip>
              ))}
            </View>
          )}

          <View style={styles.inlineRow}>
            <View style={styles.inlineInput}>
              <ThemedInput
                formTitle="Sub Group"
                placeholder="Enter group name"
                value={subGroupInput}
                onChangeText={setSubGroupInput}
              />
            </View>
            <Button
              mode="outlined"
              onClick={handleAddSubGroup}
              disabled={!subGroupInput.trim()}
              icon="plus"
            >
              Add
            </Button>
          </View>
          {subGroups.length > 0 && (
            <View style={styles.chipRow}>
              {subGroups.map((g) => (
                <Chip
                  key={g}
                  onClose={() => removeSubGroup(g)}
                  style={styles.chip}
                >
                  {g}
                </Chip>
              ))}
            </View>
          )}

          <Button
            onClick={handleSubmit}
            disabled={submitLoading || !!nameError}
            loading={submitLoading}
            icon="account-multiple-plus"
          >
            Add Team
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 6,
  },
  chip: {
    marginBottom: 2,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineInput: {
    flex: 1,
  },
});
