import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  Chip,
  Divider,
  Text,
  TextInput,
  SegmentedControl,
  IconButton,
  FAB,
  SearchBar,
  LoadingIndicator,
  EmptyState,
} from "../../components/ui";
import Typeahead from "../../components/Typeahead";
import ExerciseRow, {
  type Exercise,
} from "../../components/training/ExerciseRow";
import { getData, postData } from "../../utils/backendData";
import { alertLog } from "../../utils/alertLog";
import { useThemeColors } from "../../hooks/useThemeColors";

const DateTimePicker =
  Platform.OS !== "web"
    ? require("@react-native-community/datetimepicker").default
    : null;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type Day = (typeof DAYS)[number];

const YARDS_TO_METERS = 0.9144;

function parseInterval(mmss: string): number | null {
  if (!mmss.trim()) return null;
  const parts = mmss.split(":");
  if (parts.length !== 2) return null;
  const mm = parseInt(parts[0], 10);
  const ss = parseInt(parts[1], 10);
  if (isNaN(mm) || isNaN(ss)) return null;
  return mm * 60 + ss;
}

// ─── Training List View ─────────────────────────────────────────────────

function TrainingListView({ onAdd }: { onAdd: () => void }) {
  const [trainings, setTrainings] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getData("Trainings")
      .then(setTrainings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? trainings.filter((t) =>
        (t.Name ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : trainings;

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View className="flex-1">
      <Text variant="headline" className="text-center mt-6 mb-2">
        Trainings
      </Text>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search trainings..."
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View className="px-4 py-3 border-b border-border-light">
            <Text className="font-semibold">{item.Name ?? "Untitled"}</Text>
            <View className="flex-row gap-3 mt-1">
              {item.Date && (
                <Text variant="body-sm" className="text-foreground-muted">
                  {item.Date}
                </Text>
              )}
              {item.Notes && (
                <Text
                  variant="body-sm"
                  className="text-foreground-muted"
                  numberOfLines={1}
                >
                  {item.Notes}
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState message="No trainings yet" icon="barbell-outline" />
        }
      />
      <FAB
        icon="add"
        label="New Training"
        onPress={onAdd}
        className="absolute right-4 bottom-4"
      />
    </View>
  );
}

// ─── Training Creation Form ─────────────────────────────────────────────

const AddTraining = () => {
  const colors = useThemeColors();
  const nextExerciseId = useRef(1);
  const [view, setView] = useState<"list" | "create">("list");

  // Training fields
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<"meters" | "yards">("meters");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Record<string, any>[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<Day>>(new Set());
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Exercises
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseNames, setExerciseNames] = useState<
    { id: number; Name: string }[]
  >([]);
  const [saving, setSaving] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState("");
  const [exerciseErrors, setExerciseErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  useEffect(() => {
    getData("Teams")
      .then(setTeams)
      .catch(() => {});
    // Fetch distinct exercise names for autocomplete
    getData("Exercises")
      .then((rows) => {
        const seen = new Set<string>();
        const unique: { id: number; Name: string }[] = [];
        for (const r of rows) {
          if (r.Name && !seen.has(r.Name)) {
            seen.add(r.Name);
            unique.push({ id: r.id, Name: r.Name });
          }
        }
        setExerciseNames(unique);
      })
      .catch(() => {});
  }, []);

  const toggleDay = useCallback((day: Day) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }, []);

  const onDateChange = useCallback((_: unknown, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) setDate(selected);
  }, []);

  const formattedDate = useMemo(
    () =>
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [date],
  );

  const addExercise = useCallback(() => {
    setExercises((prev) => [
      ...prev,
      {
        id: nextExerciseId.current++,
        name: "",
        note: "",
        repetitions: "",
        distance: "",
        interval: "",
        energySystem: null,
        confirmed: false,
      },
    ]);
  }, []);

  const updateExercise = useCallback(
    (
      id: number,
      field: keyof Exercise,
      value: string | number | boolean | null,
    ) => {
      setExercises((prev) =>
        prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
      );
      // Clear field error
      setExerciseErrors((prev) => {
        if (!prev[id]) return prev;
        const updated = { ...prev[id] };
        delete updated[field];
        return { ...prev, [id]: updated };
      });
    },
    [],
  );

  const confirmExercise = useCallback((id: number) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, confirmed: true } : ex)),
    );
  }, []);

  const deleteExercise = useCallback((id: number) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  // Compute rolling totals
  const rollingTotals = useMemo(() => {
    let cumDist = 0;
    let cumTime = 0;
    return exercises.map((ex) => {
      const rep = parseInt(ex.repetitions, 10) || 0;
      const dist = parseInt(ex.distance, 10) || 0;
      const intervalSec = parseInterval(ex.interval) ?? 0;
      cumDist += rep * dist;
      cumTime += rep * intervalSec;
      return { rollingDistance: cumDist, rollingTime: cumTime };
    });
  }, [exercises]);

  // ─── Validation & Submit ────────────────────────────────────────────

  function validate(): boolean {
    let valid = true;
    const newExErrors: Record<number, Record<string, string>> = {};

    if (!name.trim()) {
      setNameError("Training name is required");
      valid = false;
    } else {
      setNameError("");
    }

    if (exercises.length === 0) {
      alertLog("Validation", "At least one exercise is required.");
      valid = false;
    }

    for (const ex of exercises) {
      const errs: Record<string, string> = {};
      if (!ex.name.trim()) errs.name = "Name required";
      if (!ex.distance.trim()) errs.distance = "Distance required";
      if (!ex.repetitions.trim()) errs.repetitions = "Reps required";
      if (ex.interval.trim() && !parseInterval(ex.interval)) {
        errs.interval = "Invalid mm:ss";
      }
      if (Object.keys(errs).length > 0) {
        newExErrors[ex.id] = errs;
        valid = false;
      }
    }

    setExerciseErrors(newExErrors);

    if (!valid && Object.keys(newExErrors).length > 0) {
      // Un-confirm exercises with errors so user can fix them
      const errorIds = new Set(Object.keys(newExErrors).map(Number));
      setExercises((prev) =>
        prev.map((ex) =>
          errorIds.has(ex.id) ? { ...ex, confirmed: false } : ex,
        ),
      );
    }

    return valid;
  }

  async function saveTraining() {
    if (!validate()) return;

    setSaving(true);
    try {
      const [training] = await postData("Trainings", {
        Name: name.trim(),
        Notes: notes.trim() || null,
        Team: teamId ?? null,
        Date: date.toISOString().split("T")[0],
        Days: [...selectedDays],
      });

      await Promise.all(
        exercises.map((ex) => {
          let distanceMeters = parseInt(ex.distance, 10) || 0;
          if (unit === "yards") {
            distanceMeters = Math.round(distanceMeters * YARDS_TO_METERS);
          }
          return postData("Exercises", {
            "Training ID": training.id,
            Name: ex.name.trim(),
            Distance: distanceMeters || null,
            Repetitions: parseInt(ex.repetitions, 10) || null,
            Interval: parseInterval(ex.interval),
            "Energy System": ex.energySystem,
            Note: ex.note.trim() || null,
          });
        }),
      );

      alertLog("Saved", "Training saved successfully.");
      // Reset and go back to list
      resetForm();
      setView("list");
    } catch (e: any) {
      alertLog("Error", e.message);
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setName("");
    setTeamId(null);
    setDate(new Date());
    setSelectedDays(new Set());
    setNotes("");
    setShowNotes(false);
    setExercises([]);
    setNameError("");
    setExerciseErrors({});
  }

  // ─── List View ──────────────────────────────────────────────────────

  if (view === "list") {
    return (
      <TrainingListView
        onAdd={() => {
          resetForm();
          setView("create");
        }}
      />
    );
  }

  // ─── Create View ────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-background">
      {/* Top bar with back + submit */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-border-light">
        <Pressable
          onPress={() => setView("list")}
          className="flex-row items-center gap-1"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.primary}
          />
          <Text className="text-primary">Back</Text>
        </Pressable>
        <Button onPress={saveTraining} loading={saving} disabled={saving}>
          Save Training
        </Button>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, gap: 8, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header Section ── */}
        <TextInput
          placeholder="Training name"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (t.trim()) setNameError("");
          }}
          error={!!nameError}
          errorMessage={nameError}
        />

        {/* Unit toggle */}
        <SegmentedControl
          options={[
            { value: "meters", label: "Meters" },
            { value: "yards", label: "Yards" },
          ]}
          selected={unit}
          onChange={(v) => setUnit(v as "meters" | "yards")}
        />

        {/* Team + Date row */}
        <View className="flex-row items-center gap-2 flex-wrap">
          <View className="flex-1 min-w-[120px]">
            <Typeahead
              array={teams}
              propertyName="Name"
              formTitle="Group"
              placeholderText="Select group..."
              allowsNew={false}
              showOnEmpty
              onSelect={(item) => setTeamId(item.id)}
              onChangeText={(text) => {
                if (!text.trim()) setTeamId(null);
              }}
            />
          </View>
          <Pressable
            onPress={() => setShowDatePicker((prev) => !prev)}
            className="border border-border rounded-md px-3 py-2.5"
          >
            <Text>{formattedDate}</Text>
          </Pressable>
        </View>

        {/* Date pickers per platform */}
        {showDatePicker && Platform.OS === "web" && (
          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => {
              setShowDatePicker(false);
              if (e.target.value)
                setDate(new Date(e.target.value + "T00:00:00"));
            }}
            onBlur={() => setShowDatePicker(false)}
            autoFocus
            style={{
              padding: "8px 12px",
              fontSize: 14,
              width: "100%",
              boxSizing: "border-box" as const,
            }}
          />
        )}
        {showDatePicker && Platform.OS === "android" && DateTimePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {Platform.OS === "ios" && DateTimePicker && (
          <Modal transparent visible={showDatePicker} animationType="fade">
            <Pressable
              className="flex-1 items-center justify-center"
              style={{ backgroundColor: colors.overlay }}
              onPress={() => setShowDatePicker(false)}
            >
              <Pressable
                className="self-stretch mx-4 rounded-xl overflow-hidden"
                style={{ backgroundColor: colors.backgroundModal }}
              >
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="inline"
                  onChange={onDateChange}
                />
              </Pressable>
            </Pressable>
          </Modal>
        )}

        {/* Days row */}
        <View className="flex-row items-center gap-2 flex-wrap">
          <View className="flex-row flex-wrap gap-1.5 flex-1">
            {DAYS.map((day) => (
              <Chip
                key={day}
                label={day}
                selected={selectedDays.has(day)}
                onPress={() => toggleDay(day)}
                compact
              />
            ))}
          </View>
          <IconButton
            icon={
              showNotes ? "document-text" : ("document-text-outline" as any)
            }
            size={20}
            onPress={() => setShowNotes((v) => !v)}
          />
        </View>

        {/* Collapsible notes */}
        {showNotes && (
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Training notes..."
            multiline
            numberOfLines={3}
          />
        )}

        <Divider className="my-2" />

        {/* ── Exercise Section ── */}
        <View className="flex-row items-center justify-between mb-2">
          <Text variant="title">Exercises</Text>
          {exercises.length > 0 && (
            <Text variant="body-sm" className="text-foreground-muted">
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {/* Column headers for confirmed exercises */}
        {exercises.some((ex) => ex.confirmed) && (
          <View className="flex-row items-center px-3 mb-1">
            <View className="flex-1" />
            <Text
              variant="label-sm"
              className="opacity-60 w-16 text-right"
            >
              Dist
            </Text>
            <Text
              variant="label-sm"
              className="opacity-60 w-16 text-right ml-4"
            >
              Time
            </Text>
          </View>
        )}

        {exercises.map((ex, i) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            index={i}
            unit={unit}
            exerciseNames={exerciseNames}
            rollingDistance={rollingTotals[i]?.rollingDistance ?? 0}
            rollingTime={rollingTotals[i]?.rollingTime ?? 0}
            errors={exerciseErrors[ex.id] ?? {}}
            onUpdate={(field, value) => updateExercise(ex.id, field, value)}
            onConfirm={() => confirmExercise(ex.id)}
            onDelete={() => deleteExercise(ex.id)}
          />
        ))}

        <Button
          variant="outlined"
          onPress={addExercise}
          icon={<Ionicons name="add" size={18} color={colors.primary} />}
        >
          Add Exercise
        </Button>
      </ScrollView>
    </View>
  );
};

export default AddTraining;
