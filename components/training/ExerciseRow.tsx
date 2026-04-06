import React, { useRef } from "react";
import { View, TextInput as RNTextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TextInput, Chip } from "@/components/ui";
import Typeahead from "@/components/Typeahead";
import { SWIM_DISTANCES } from "@/constants/swimmingConstants";
import { useThemeColors } from "@/hooks/useThemeColors";

const ENERGY_SYSTEMS = ["N1", "N2", "N3", "N4"] as const;

export type Exercise = {
  id: number;
  name: string;
  note: string;
  repetitions: string;
  distance: string;
  interval: string; // mm:ss
  energySystem: string | null;
  confirmed: boolean;
};

interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  unit: "meters" | "yards";
  exerciseNames: { id: number; Name: string }[];
  rollingDistance: number;
  rollingTime: number;
  errors: Record<string, string>;
  onUpdate: (field: keyof Exercise, value: string | number | boolean | null) => void;
  onConfirm: () => void;
  onDelete: () => void;
}

function parseInterval(mmss: string): number | null {
  if (!mmss.trim()) return null;
  const parts = mmss.split(":");
  if (parts.length !== 2) return null;
  const mm = parseInt(parts[0], 10);
  const ss = parseInt(parts[1], 10);
  if (isNaN(mm) || isNaN(ss)) return null;
  return mm * 60 + ss;
}

function formatSeconds(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ExerciseRow({
  exercise,
  index,
  unit,
  exerciseNames,
  rollingDistance,
  rollingTime,
  errors,
  onUpdate,
  onConfirm,
  onDelete,
}: ExerciseRowProps) {
  const colors = useThemeColors();
  const repRef = useRef<RNTextInput>(null);
  const distRef = useRef<RNTextInput>(null);
  const intervalRef = useRef<RNTextInput>(null);

  const rep = parseInt(exercise.repetitions, 10) || 0;
  const dist = parseInt(exercise.distance, 10) || 0;
  const intervalSec = parseInterval(exercise.interval);
  const exerciseTotalDist = rep * dist;
  const exerciseTotalTime = intervalSec ? rep * intervalSec : 0;

  const distanceOptions = SWIM_DISTANCES[unit].map((d) => ({
    id: d,
    Name: String(d),
  }));

  // Confirmed view — compact display
  if (exercise.confirmed) {
    const setDisplay = [
      exercise.repetitions && exercise.distance
        ? `${exercise.repetitions} x ${exercise.distance}`
        : null,
      exercise.interval ? `@ ${exercise.interval}` : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Pressable
        onPress={() => onUpdate("confirmed", false)}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${exercise.name || `Exercise ${index + 1}`}`}
        className="border border-border rounded-lg p-3 mb-2 bg-background-card"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-semibold text-foreground">
                {exercise.name || `Exercise ${index + 1}`}
              </Text>
              {exercise.energySystem && (
                <View className="bg-primary/20 rounded-full px-2 py-0.5">
                  <Text variant="body-sm" className="text-primary font-medium">
                    {exercise.energySystem}
                  </Text>
                </View>
              )}
            </View>
            {setDisplay && <Text className="text-foreground-secondary">{setDisplay}</Text>}
            {exercise.note ? (
              <Text variant="body-sm" className="text-foreground-muted italic">
                {exercise.note}
              </Text>
            ) : null}
          </View>

          {/* Computed columns */}
          <View className="items-end gap-0.5">
            <Text className="font-medium">{exerciseTotalDist}</Text>
            <Text variant="body-sm" className="text-foreground-muted">
              ({rollingDistance})
            </Text>
          </View>
          <View className="items-end gap-0.5 ml-4">
            <Text className="font-medium">
              {exerciseTotalTime > 0 ? formatSeconds(exerciseTotalTime) : "--"}
            </Text>
            <Text variant="body-sm" className="text-foreground-muted">
              ({rollingTime > 0 ? formatSeconds(rollingTime) : "--"})
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Editing view — full inputs
  return (
    <View className="border border-border rounded-lg p-3 mb-2 gap-2">
      <View className="flex-row items-center justify-between">
        <Text variant="label-sm" className="opacity-60">
          Exercise {index + 1}
        </Text>
        <View className="flex-row gap-1">
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </Pressable>
        </View>
      </View>

      {/* Name with typeahead */}
      <Typeahead
        array={exerciseNames}
        propertyName="Name"
        formTitle="Name"
        placeholderText="Exercise name"
        value={exercise.name}
        allowsNew
        showOnEmpty={false}
        onChangeText={(t) => onUpdate("name", t)}
        onSelect={(item) => onUpdate("name", item.Name)}
      />
      {errors.name && (
        <Text variant="body-sm" className="text-danger ml-1">
          {errors.name}
        </Text>
      )}

      {/* Row: Reps + Distance + Interval */}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <TextInput
            ref={repRef}
            label="Reps"
            value={exercise.repetitions}
            onChangeText={(v) => onUpdate("repetitions", v)}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => distRef.current?.focus()}
            error={!!errors.repetitions}
            errorMessage={errors.repetitions}
          />
        </View>
        <View className="flex-1">
          <Typeahead
            array={distanceOptions}
            propertyName="Name"
            formTitle="Distance"
            placeholderText={unit === "meters" ? "m" : "yd"}
            value={exercise.distance}
            allowsNew={false}
            showOnEmpty
            onChangeText={(t) => onUpdate("distance", t)}
            onSelect={(item) => onUpdate("distance", item.Name)}
          />
          {errors.distance && (
            <Text variant="body-sm" className="text-danger ml-1">
              {errors.distance}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <TextInput
            ref={intervalRef}
            label="Interval"
            value={exercise.interval}
            onChangeText={(v) => onUpdate("interval", v)}
            placeholder="mm:ss"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Energy System */}
      <View className="gap-1">
        <Text variant="label-sm" className="opacity-60 ml-1">
          Energy System
        </Text>
        <View className="flex-row gap-1.5">
          {ENERGY_SYSTEMS.map((es) => (
            <Chip
              key={es}
              label={es}
              selected={exercise.energySystem === es}
              onPress={() =>
                onUpdate(
                  "energySystem",
                  exercise.energySystem === es ? null : es,
                )
              }
              compact
            />
          ))}
        </View>
      </View>

      {/* Note */}
      <TextInput
        label="Note"
        value={exercise.note}
        onChangeText={(v) => onUpdate("note", v)}
        placeholder="Optional note..."
      />

      {/* Confirm button */}
      <Pressable
        onPress={onConfirm}
        className="flex-row items-center justify-center gap-2 bg-success/15 rounded-lg py-2.5 mt-1"
        style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
      >
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        <Text className="text-success font-medium">Confirm Exercise</Text>
      </Pressable>
    </View>
  );
}
