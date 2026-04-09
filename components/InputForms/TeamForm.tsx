import { View } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, TextInput, Button, Chip, Snackbar } from "@/components/ui";
import Typeahead from "@/components/Typeahead";
import { useThemeColors } from "@/hooks/useThemeColors";
import { postData, updateData } from "@/utils/backendData";
import { useData } from "@/context/DataContext";

export default function TeamForm({ onSuccess }: { onSuccess?: (msg: string) => void } = {}) {
  const colors = useThemeColors();
  const { teams: teamData, athletes: athleteData } = useData();
  const [name, setName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<Record<string, any>[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

      const msg = `Successfully added new group ${name.trim()}`;
      if (onSuccess) {
        onSuccess(msg);
      } else {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
      }
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
          icon={<Ionicons name="people-outline" size={18} color={colors.onPrimary} />}
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
