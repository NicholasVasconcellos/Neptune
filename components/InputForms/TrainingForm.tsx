import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  Snackbar,
  SegmentedButtons,
  Chip,
  Divider,
  IconButton,
  HelperText,
  ActivityIndicator,
} from "react-native-paper";

import Title from "../Title";
import ThemedInput from "../ThemedInput";
import Typeahead from "../Typeahead";
import Button from "../Button";
import { getData, postData } from "../../utils/backendData";
import {
  YARD_DISTANCES,
  METER_DISTANCES,
  ENERGY_SYSTEMS,
  DAYS_OF_WEEK,
} from "../../constants/swimmingConstants";

// ---- Types ----------------------------------------------------------------

interface ExerciseRow {
  key: string;
  name: string;
  note: string;
  reps: string;
  distanceVal: number | null; // numeric distance value (yards/meters)
  distanceName: string;
  interval: string; // mm:ss
  energySystem: string;
}

interface TrainingFormProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

// ---- Helpers ---------------------------------------------------------------

function parseIntervalSeconds(interval: string): number {
  const parts = interval.split(":");
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

function secondsToMmSs(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function addTimeString(base: string, offsetSeconds: number): string {
  // base is HH:MM
  if (!base || !base.includes(":")) return "--:--";
  const parts = base.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const mins = parseInt(parts[1], 10) || 0;
  const baseSecs = hours * 3600 + mins * 60;
  const total = baseSecs + offsetSeconds;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

let rowCounter = 0;
function newRow(): ExerciseRow {
  rowCounter += 1;
  return {
    key: String(rowCounter),
    name: "",
    note: "",
    reps: "",
    distanceVal: null,
    distanceName: "",
    interval: "",
    energySystem: "",
  };
}

// ---- Component -------------------------------------------------------------

export default function TrainingForm({ onSubmit, onCancel }: TrainingFormProps) {
  // Training header state
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<{ id: string; Name: string }[]>([]);
  const [distanceUnit, setDistanceUnit] = useState("yards");

  // Exercise rows
  const [exercises, setExercises] = useState<ExerciseRow[]>([newRow()]);

  // Remote data
  const [teamsData, setTeamsData] = useState<Record<string, any>[]>([]);
  const [existingExerciseNames, setExistingExerciseNames] = useState<Record<string, any>[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Submission
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [exercisesError, setExercisesError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Derived: distance options for typeahead
  const distanceData = (distanceUnit === "yards" ? YARD_DISTANCES : METER_DISTANCES).map((d) => ({
    id: d,
    Name: String(d),
  }));

  // Fetch reference data on mount
  useEffect(() => {
    async function fetchData() {
      setTeamsLoading(true);
      try {
        const [teams, exNames] = await Promise.all([
          getData("Teams"),
          getData("Exercises"),
        ]);
        setTeamsData(teams);
        // Deduplicate exercise names for typeahead
        const seen = new Set<string>();
        const unique: Record<string, any>[] = [];
        for (const ex of exNames) {
          if (ex.Name && !seen.has(ex.Name)) {
            seen.add(ex.Name);
            unique.push({ id: ex.id, Name: ex.Name });
          }
        }
        setExistingExerciseNames(unique);
      } catch {
        // silently fail — lists just won't populate
      } finally {
        setTeamsLoading(false);
      }
    }
    fetchData();
  }, []);

  // ---- Days multiselect helpers -------------------------------------------

  function toggleDay(day: { id: string; Name: string }) {
    setSelectedDays((prev) => {
      const exists = prev.some((d) => d.id === day.id);
      return exists ? prev.filter((d) => d.id !== day.id) : [...prev, day];
    });
  }

  // ---- Exercise row helpers ------------------------------------------------

  function updateRow(key: string, patch: Partial<ExerciseRow>) {
    setExercises((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function addRow() {
    setExercises((prev) => [...prev, newRow()]);
  }

  function removeRow(key: string) {
    setExercises((prev) => prev.filter((r) => r.key !== key));
  }

  // ---- Rolling computations ------------------------------------------------

  // Returns cumulative distance (meters/yards) up to and including rowIndex
  function rollingDistance(upToIndex: number): number {
    let total = 0;
    for (let i = 0; i <= upToIndex; i++) {
      const row = exercises[i];
      const reps = parseInt(row.reps, 10) || 0;
      const dist = row.distanceVal ?? 0;
      total += reps * dist;
    }
    return total;
  }

  // Returns cumulative interval seconds up to and including rowIndex
  function rollingSeconds(upToIndex: number): number {
    let total = 0;
    for (let i = 0; i <= upToIndex; i++) {
      const row = exercises[i];
      const reps = parseInt(row.reps, 10) || 0;
      const intervalSecs = parseIntervalSeconds(row.interval);
      total += reps * intervalSecs;
    }
    return total;
  }

  // ---- Submit --------------------------------------------------------------

  async function handleSubmit() {
    setNameError("");
    setExercisesError("");

    let hasError = false;
    if (!name.trim()) {
      setNameError("Training name is required");
      hasError = true;
    }
    const filledExercises = exercises.filter((r) => r.name.trim());
    if (filledExercises.length === 0) {
      setExercisesError("Add at least one exercise");
      hasError = true;
    }
    if (hasError) return;

    setSubmitLoading(true);
    try {
      const trainingRecord: Record<string, any> = {
        Name: name.trim(),
        Notes: notes.trim() || null,
        Team: teamId,
        Date: date || null,
        Days: selectedDays.map((d) => d.id),
      };

      const trainingResult = await postData("Trainings", trainingRecord);
      const trainingId = trainingResult?.[0]?.id;

      if (!trainingId) throw new Error("Failed to create training");

      await Promise.all(
        filledExercises.map((row) =>
          postData("Exercises", {
            Training: trainingId,
            Name: row.name.trim(),
            Note: row.note.trim() || null,
            Repetitions: parseInt(row.reps, 10) || null,
            Distance: row.distanceVal,
            Interval: parseIntervalSeconds(row.interval) || null,
            "Energy System": row.energySystem || null,
          })
        )
      );

      setSnackbarMessage("Training saved!");
      setSnackbarVisible(true);
      setTimeout(() => onSubmit?.(), 1500);
    } catch (e: any) {
      setSnackbarMessage(e.message ?? "An error occurred");
      setSnackbarVisible(true);
    } finally {
      setSubmitLoading(false);
    }
  }

  // ---- Render --------------------------------------------------------------

  return (
    <>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---- Training Header ---- */}
        <Title>New Training</Title>

        <ThemedInput
          formTitle="Name *"
          value={name}
          onChangeText={(t) => { setName(t); setNameError(""); }}
        />
        {!!nameError && <HelperText type="error" visible>{nameError}</HelperText>}

        <ThemedInput
          formTitle="Notes"
          value={notes}
          onChangeText={setNotes}
        />

        <Typeahead
          array={teamsData}
          propertyName="Name"
          formTitle="Team"
          placeholderText="Search for team"
          loading={teamsLoading}
          value={teamName}
          allowsNew={false}
          showOnEmpty
          onChangeText={(t) => { setTeamName(t); setTeamId(null); }}
          onSelect={(item) => { setTeamName(item.Name); setTeamId(item.id); }}
        />

        <ThemedInput
          formTitle="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2025-06-01"
        />

        <ThemedInput
          formTitle="Start Time (HH:MM)"
          value={startTime}
          onChangeText={setStartTime}
          placeholder="07:30"
        />

        {/* Recurring Days */}
        <Text variant="labelMedium" style={styles.sectionLabel}>Recurring Days</Text>
        <View style={styles.daysRow}>
          {DAYS_OF_WEEK.map((day) => {
            const selected = selectedDays.some((d) => d.id === day.id);
            return (
              <Chip
                key={day.id}
                selected={selected}
                onPress={() => toggleDay(day)}
                style={styles.dayChip}
                compact
              >
                {day.id}
              </Chip>
            );
          })}
        </View>

        {/* Distance Unit */}
        <Text variant="labelMedium" style={styles.sectionLabel}>Distance Unit</Text>
        <SegmentedButtons
          value={distanceUnit}
          onValueChange={(v) => {
            setDistanceUnit(v);
            // Reset distance selections when unit changes
            setExercises((prev) =>
              prev.map((r) => ({ ...r, distanceVal: null, distanceName: "" }))
            );
          }}
          buttons={[
            { value: "yards", label: "Yards" },
            { value: "meters", label: "Meters" },
          ]}
          style={styles.unitToggle}
        />

        <Divider style={styles.divider} />

        {/* ---- Exercises ---- */}
        <Text variant="titleMedium" style={styles.sectionLabel}>Exercises</Text>
        {!!exercisesError && (
          <HelperText type="error" visible>{exercisesError}</HelperText>
        )}

        {exercises.map((row, idx) => {
          const reps = parseInt(row.reps, 10) || 0;
          const rowDist = reps * (row.distanceVal ?? 0);
          const rollingDist = rollingDistance(idx);
          const rowSecs = reps * parseIntervalSeconds(row.interval);
          const rollingSecs = rollingSeconds(idx);
          const currentClock = addTimeString(startTime, rollingSecs);

          return (
            <View key={row.key} style={styles.exerciseCard}>
              {/* Row header */}
              <View style={styles.rowHeader}>
                <Text variant="labelLarge">Exercise {idx + 1}</Text>
                {exercises.length > 1 && (
                  <IconButton
                    icon="close"
                    size={18}
                    onPress={() => removeRow(row.key)}
                  />
                )}
              </View>

              {/* Name */}
              <Typeahead
                array={existingExerciseNames}
                propertyName="Name"
                formTitle="Name *"
                placeholderText="Exercise name"
                value={row.name}
                allowsNew
                showOnEmpty={false}
                onChangeText={(t) => updateRow(row.key, { name: t })}
                onSelect={(item) => updateRow(row.key, { name: item.Name })}
              />

              {/* Note */}
              <ThemedInput
                formTitle="Note"
                value={row.note}
                onChangeText={(t) => updateRow(row.key, { note: t })}
              />

              {/* Reps */}
              <ThemedInput
                formTitle="Repetitions"
                value={row.reps}
                onChangeText={(t) => updateRow(row.key, { reps: t })}
                keyboardType="number-pad"
              />

              {/* Distance */}
              <Typeahead
                array={distanceData}
                propertyName="Name"
                formTitle={`Distance (${distanceUnit})`}
                placeholderText="Select distance"
                value={row.distanceName}
                allowsNew={false}
                showOnEmpty
                onChangeText={(t) => updateRow(row.key, { distanceName: t, distanceVal: null })}
                onSelect={(item) => updateRow(row.key, { distanceName: item.Name, distanceVal: item.id })}
              />

              {/* Distance summary */}
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">
                  {reps > 0 && row.distanceVal
                    ? `${reps} × ${row.distanceVal} = ${rowDist} ${distanceUnit}`
                    : "—"}
                </Text>
                {rollingDist > 0 && (
                  <Text variant="bodySmall" style={styles.dimText}>
                    ({rollingDist} {distanceUnit} total)
                  </Text>
                )}
              </View>

              {/* Interval */}
              <ThemedInput
                formTitle="Interval (mm:ss)"
                value={row.interval}
                onChangeText={(t) => updateRow(row.key, { interval: t })}
                placeholder="01:30"
              />

              {/* Time summary */}
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">
                  {row.interval ? row.interval : "—"}
                </Text>
                {rollingSecs > 0 && (
                  <>
                    <Text variant="bodySmall" style={styles.dimText}>
                      ({secondsToMmSs(rollingSecs)} rolling)
                    </Text>
                    {startTime ? (
                      <Text variant="bodySmall" style={styles.dimText}>
                        Clock: {currentClock}
                      </Text>
                    ) : null}
                  </>
                )}
              </View>

              {/* Energy System */}
              <Text variant="labelMedium" style={styles.sectionLabel}>Energy System</Text>
              <SegmentedButtons
                value={row.energySystem}
                onValueChange={(v) => updateRow(row.key, { energySystem: v })}
                buttons={ENERGY_SYSTEMS.map((es) => ({ value: es, label: es }))}
              />

              {/* Summary line */}
              {(row.reps || row.distanceName || row.interval) ? (
                <Text variant="bodySmall" style={styles.summaryLine}>
                  {row.reps || "?"} × {row.distanceName || "?"} @ {row.interval || "?"}
                </Text>
              ) : null}

              <Divider style={styles.rowDivider} />
            </View>
          );
        })}

        {/* Add Exercise Row */}
        <Button
          onClick={addRow}
          mode="outlined"
          icon="plus"
        >
          Add Exercise
        </Button>

        <Divider style={styles.divider} />

        {/* Submit / Cancel */}
        <Button
          onClick={handleSubmit}
          disabled={submitLoading}
          loading={submitLoading}
          icon="check"
        >
          Save Training
        </Button>

        <Button
          onClick={onCancel}
          mode="outlined"
          icon="close"
        >
          Cancel
        </Button>
      </ScrollView>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 4,
    paddingBottom: 32,
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  dayChip: {
    marginBottom: 4,
  },
  unitToggle: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  exerciseCard: {
    marginBottom: 8,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  summaryLine: {
    opacity: 0.8,
    fontStyle: "italic",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  dimText: {
    opacity: 0.55,
  },
  rowDivider: {
    marginTop: 12,
    marginBottom: 4,
  },
});
