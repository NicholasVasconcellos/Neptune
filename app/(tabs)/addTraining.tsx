import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Modal as RNModal,
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
  Modal,
  SegmentedControl,
  IconButton,
  FAB,
  SearchBar,
  LoadingIndicator,
  EmptyState,
} from "@/components/ui";
import Typeahead from "@/components/Typeahead";
import ExerciseRow, {
  type Exercise,
} from "@/components/training/ExerciseRow";
import TrainingViewMode from "@/components/training/TrainingViewMode";
import { getData, postData, updateData, deleteData, deleteByFilter } from "@/utils/backendData";
import { alertLog } from "@/utils/alertLog";
import { useThemeColors } from "@/hooks/useThemeColors";
import { exportTrainingCSV, exportTrainingPDF } from "@/utils/exportTraining";
import { parseTimeToSeconds, formatTime } from "@/utils/timeFormatting";

const DateTimePicker =
  Platform.OS !== "web"
    ? require("@react-native-community/datetimepicker").default
    : null;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
type Day = (typeof DAYS)[number];

const YARDS_TO_METERS = 0.9144;

// ─── Training List View ─────────────────────────────────────────────────

function TrainingListView({
  onAdd,
  onEdit,
  onDelete,
  refreshKey,
}: {
  onAdd: () => void;
  onEdit: (training: Record<string, any>) => void;
  onDelete: (training: Record<string, any>) => void;
  refreshKey: number;
}) {
  const colors = useThemeColors();
  const [trainings, setTrainings] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Export modal state
  const [selectedTraining, setSelectedTraining] = useState<Record<string, any> | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Record<string, any>[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  useEffect(() => {
    setLoading(true);
    getData("Trainings")
      .then(setTrainings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = search.trim()
    ? trainings.filter((t) =>
        (t.Name ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : trainings;

  const openExportModal = useCallback(async (training: Record<string, any>) => {
    setSelectedTraining(training);
    setLoadingExercises(true);
    try {
      const exercises = await getData("Exercises", { "Training ID": training.id });
      setSelectedExercises(exercises);
    } catch {
      setSelectedExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  }, []);

  const handleExport = useCallback(async (format: "csv" | "pdf") => {
    if (!selectedTraining) return;
    setExporting(format);
    try {
      if (format === "csv") {
        await exportTrainingCSV(selectedTraining, selectedExercises);
      } else {
        await exportTrainingPDF(selectedTraining, selectedExercises);
      }
    } catch (e: any) {
      alertLog("Export Error", e.message);
    } finally {
      setExporting(null);
    }
  }, [selectedTraining, selectedExercises]);

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
          <Pressable
            onPress={() => onEdit(item)}
            onLongPress={() => onDelete(item)}
            className="px-4 py-3 border-b border-border-light"
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold flex-1">{item.Name ?? "Untitled"}</Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  openExportModal(item);
                }}
                hitSlop={8}
              >
                <Ionicons name="share-outline" size={18} color={colors.foregroundMuted} />
              </Pressable>
            </View>
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
          </Pressable>
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

      {/* Export Modal */}
      <Modal
        visible={selectedTraining !== null}
        onClose={() => setSelectedTraining(null)}
        title={selectedTraining?.Name ?? "Export Training"}
      >
        {loadingExercises ? (
          <LoadingIndicator />
        ) : (
          <View className="gap-3">
            <View className="gap-1">
              {selectedTraining?.Date && (
                <Text variant="body-sm" className="text-foreground-muted">
                  Date: {selectedTraining.Date}
                </Text>
              )}
              {selectedTraining?.Notes && (
                <Text variant="body-sm" className="text-foreground-muted">
                  Notes: {selectedTraining.Notes}
                </Text>
              )}
              <Text variant="body-sm" className="text-foreground-muted">
                {selectedExercises.length} exercise{selectedExercises.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <Divider />

            <Button
              variant="outlined"
              onPress={() => handleExport("csv")}
              loading={exporting === "csv"}
              disabled={exporting !== null}
              icon={<Ionicons name="document-text-outline" size={18} color={colors.primary} />}
            >
              Export CSV
            </Button>
            <Button
              onPress={() => handleExport("pdf")}
              loading={exporting === "pdf"}
              disabled={exporting !== null}
              icon={<Ionicons name="download-outline" size={18} color="#fff" />}
            >
              Export PDF
            </Button>
          </View>
        )}
      </Modal>
    </View>
  );
}

// ─── Training Creation Form ─────────────────────────────────────────────

const AddTraining = () => {
  const colors = useThemeColors();
  const nextExerciseId = useRef(1);
  const [view, setView] = useState<"list" | "view" | "edit" | "create">("list");
  const [editingTrainingId, setEditingTrainingId] = useState<number | null>(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");

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
  const [hasChanges, setHasChanges] = useState(false);

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

  const teamName = useMemo(() => {
    if (!teamId) return undefined;
    return teams.find((t) => t.id === teamId)?.Name;
  }, [teamId, teams]);

  const toggleDay = useCallback((day: Day) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
    setHasChanges(true);
  }, []);

  const onDateChange = useCallback((_: unknown, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setDate(selected);
      setHasChanges(true);
    }
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
    setHasChanges(true);
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
      if (field !== "confirmed") setHasChanges(true);
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
    setHasChanges(true);
  }, []);

  // Compute rolling totals
  const rollingTotals = useMemo(() => {
    let cumDist = 0;
    let cumTime = 0;
    return exercises.map((ex) => {
      const rep = parseInt(ex.repetitions, 10) || 0;
      const dist = parseInt(ex.distance, 10) || 0;
      const intervalSec = parseTimeToSeconds(ex.interval) ?? 0;
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
      if (ex.interval.trim() && parseTimeToSeconds(ex.interval) === null) {
        errs.interval = "Invalid time — use MM:SS.ms";
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
            Interval: parseTimeToSeconds(ex.interval),
            "Energy System": ex.energySystem,
            Note: ex.note.trim() || null,
          });
        }),
      );

      alertLog("Saved", "Training saved successfully.");
      resetForm();
      setListRefreshKey((k) => k + 1);
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
    setHasChanges(false);
  }

  // ─── Open for View ──────────────────────────────────────────────────

  async function openForView(training: Record<string, any>) {
    resetForm();
    setEditingTrainingId(training.id);
    setName(training.Name ?? "");
    setNotes(training.Notes ?? "");
    setShowNotes(!!training.Notes);
    setUnit("meters");
    setTeamId(training.Team ?? null);

    if (training.Date) {
      setDate(new Date(training.Date + "T00:00:00"));
    }
    if (Array.isArray(training.Days)) {
      setSelectedDays(new Set(training.Days as Day[]));
    }

    try {
      const rows = await getData("Exercises", { "Training ID": training.id });
      const loaded: Exercise[] = rows.map((row: Record<string, any>) => ({
        id: nextExerciseId.current++,
        name: row.Name ?? "",
        note: row.Note ?? "",
        repetitions: row.Repetitions != null ? String(row.Repetitions) : "",
        distance: row.Distance != null ? String(row.Distance) : "",
        interval: row.Interval != null ? formatTime(row.Interval) : "",
        energySystem: row["Energy System"] ?? null,
        confirmed: true,
      }));
      setExercises(loaded);
    } catch (e: any) {
      alertLog("Error", "Could not load exercises: " + e.message);
    }

    setView("view");
  }

  // ─── Update Existing Training ─────────────────────────────────────

  async function updateTraining() {
    if (!validate() || !editingTrainingId) return;

    setSaving(true);
    try {
      await updateData("Trainings", editingTrainingId, {
        Name: name.trim(),
        Notes: notes.trim() || null,
        Team: teamId ?? null,
        Date: date.toISOString().split("T")[0],
        Days: [...selectedDays],
      });

      await deleteByFilter("Exercises", { "Training ID": editingTrainingId });

      await Promise.all(
        exercises.map((ex) => {
          let distanceMeters = parseInt(ex.distance, 10) || 0;
          if (unit === "yards") {
            distanceMeters = Math.round(distanceMeters * YARDS_TO_METERS);
          }
          return postData("Exercises", {
            "Training ID": editingTrainingId,
            Name: ex.name.trim(),
            Distance: distanceMeters || null,
            Repetitions: parseInt(ex.repetitions, 10) || null,
            Interval: parseTimeToSeconds(ex.interval),
            "Energy System": ex.energySystem,
            Note: ex.note.trim() || null,
          });
        }),
      );

      alertLog("Updated", "Training updated successfully.");
      resetForm();
      setEditingTrainingId(null);
      setListRefreshKey((k) => k + 1);
      setView("list");
    } catch (e: any) {
      alertLog("Error", e.message);
    } finally {
      setSaving(false);
    }
  }

  // ─── Save As New Training ─────────────────────────────────────────

  async function saveAsTraining() {
    if (!validate()) return;

    setSaving(true);
    try {
      const [training] = await postData("Trainings", {
        Name: saveAsName.trim(),
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
            Interval: parseTimeToSeconds(ex.interval),
            "Energy System": ex.energySystem,
            Note: ex.note.trim() || null,
          });
        }),
      );

      alertLog("Saved", `"${saveAsName.trim()}" created successfully.`);
      setShowSaveAsModal(false);
      resetForm();
      setEditingTrainingId(null);
      setListRefreshKey((k) => k + 1);
      setView("list");
    } catch (e: any) {
      alertLog("Error", e.message);
    } finally {
      setSaving(false);
    }
  }

  // ─── Discard Changes ───────────────────────────────────────────────

  function confirmDiscard() {
    if (Platform.OS === "web") {
      if (window.confirm("Discard all changes?")) {
        resetForm();
        setEditingTrainingId(null);
        setView("list");
      }
    } else {
      Alert.alert("Discard Changes", "Discard all changes?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            resetForm();
            setEditingTrainingId(null);
            setView("list");
          },
        },
      ]);
    }
  }

  // ─── Confirm Save (Edit Mode) ─────────────────────────────────────

  function confirmSave() {
    if (Platform.OS === "web") {
      if (window.confirm("Override existing training?")) {
        updateTraining();
      }
    } else {
      Alert.alert("Save Training", "How would you like to save?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save As Copy",
          onPress: () => {
            if (!validate()) return;
            setSaveAsName(name.trim() + " (Copy)");
            setShowSaveAsModal(true);
          },
        },
        { text: "Override", style: "destructive", onPress: updateTraining },
      ]);
    }
  }

  // ─── Delete from List ──────────────────────────────────────────────

  function handleDeleteFromList(training: Record<string, any>) {
    if (Platform.OS === "web") {
      if (window.confirm("Delete this training? This cannot be undone.")) {
        performDeleteFromList(training.id);
      }
    } else {
      Alert.alert(
        "Delete Training",
        "Delete this training? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDeleteFromList(training.id),
          },
        ],
      );
    }
  }

  async function performDeleteFromList(id: number) {
    try {
      await deleteData("Trainings", id);
      alertLog("Deleted", "Training deleted.");
      setListRefreshKey((k) => k + 1);
    } catch (e: any) {
      alertLog("Error", e.message);
    }
  }

  // ─── List View ──────────────────────────────────────────────────────

  if (view === "list") {
    return (
      <TrainingListView
        onAdd={() => {
          resetForm();
          setEditingTrainingId(null);
          setView("create");
        }}
        onEdit={openForView}
        onDelete={handleDeleteFromList}
        refreshKey={listRefreshKey}
      />
    );
  }

  // ─── View Mode ────────────────────────────────────────────────────

  if (view === "view") {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-border-light">
          <Pressable
            onPress={() => {
              setEditingTrainingId(null);
              setView("list");
            }}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text className="text-primary">Back</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setHasChanges(false);
              setView("edit");
            }}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text className="text-primary">Edit</Text>
          </Pressable>
        </View>
        <TrainingViewMode
          name={name}
          date={date}
          selectedDays={selectedDays}
          teamName={teamName}
          notes={notes}
          exercises={exercises}
          unit={unit}
        />
      </View>
    );
  }

  // ─── Create / Edit Form ───────────────────────────────────────────

  return (
    <View className="flex-1 bg-background">
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-border-light">
        {view === "edit" ? (
          <Pressable
            onPress={confirmDiscard}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text className="text-danger">Discard</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setEditingTrainingId(null);
              setView("list");
            }}
            className="flex-row items-center gap-1"
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
            <Text className="text-primary">Back</Text>
          </Pressable>
        )}
        <View className="flex-row items-center gap-2">
          {view === "edit" && (
            <Button
              variant="outlined"
              onPress={() => {
                if (!validate()) return;
                setSaveAsName(name.trim() + " (Copy)");
                setShowSaveAsModal(true);
              }}
              disabled={saving}
              icon={<Ionicons name="copy-outline" size={18} color={colors.primary} />}
            >
              Save As
            </Button>
          )}
          {(view !== "edit" || hasChanges) && (
            <Button
              onPress={view === "edit" ? confirmSave : saveTraining}
              loading={saving}
              disabled={saving}
              icon={<Ionicons name="save-outline" size={18} color={colors.onPrimary} />}
            >
              {view === "edit" ? "Save" : "Save Training"}
            </Button>
          )}
        </View>
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
            setHasChanges(true);
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
          onChange={(v) => {
            setUnit(v as "meters" | "yards");
            setHasChanges(true);
          }}
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
              value={teamId ? teams.find((t) => t.id === teamId)?.Name ?? "" : ""}
              onSelect={(item) => {
                setTeamId(item.id);
                setHasChanges(true);
              }}
              onChangeText={(text) => {
                if (!text.trim()) setTeamId(null);
                setHasChanges(true);
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
              if (e.target.value) {
                setDate(new Date(e.target.value + "T00:00:00"));
                setHasChanges(true);
              }
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
          <RNModal transparent visible={showDatePicker} animationType="fade">
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
          </RNModal>
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
            onChangeText={(t) => {
              setNotes(t);
              setHasChanges(true);
            }}
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

      {/* Save As Modal */}
      <Modal
        visible={showSaveAsModal}
        onClose={() => setShowSaveAsModal(false)}
        title="Save As New Training"
      >
        <View className="gap-3">
          <TextInput
            label="New training name"
            value={saveAsName}
            onChangeText={setSaveAsName}
            autoFocus
          />
          <View className="flex-row gap-2 justify-end">
            <Button variant="text" onPress={() => setShowSaveAsModal(false)}>
              Cancel
            </Button>
            <Button
              onPress={saveAsTraining}
              loading={saving}
              disabled={saving || !saveAsName.trim()}
            >
              Create Copy
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddTraining;
