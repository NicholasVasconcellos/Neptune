import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Divider } from "@/components/ui";
import ExerciseRow, { type Exercise } from "./ExerciseRow";
import { parseTimeToSeconds, formatTime } from "@/utils/timeFormatting";

interface TrainingViewModeProps {
  name: string;
  date: Date;
  selectedDays: Set<string>;
  teamName?: string;
  notes?: string;
  exercises: Exercise[];
  unit: "meters" | "yards";
}

export default function TrainingViewMode({
  name,
  date,
  selectedDays,
  teamName,
  notes,
  exercises,
  unit,
}: TrainingViewModeProps) {
  let cumDist = 0;
  let cumTime = 0;
  const rollingTotals = exercises.map((ex) => {
    const rep = parseInt(ex.repetitions, 10) || 0;
    const dist = parseInt(ex.distance, 10) || 0;
    const intervalSec = parseTimeToSeconds(ex.interval) ?? 0;
    cumDist += rep * dist;
    cumTime += rep * intervalSec;
    return { rollingDistance: cumDist, rollingTime: cumTime };
  });

  const totalDistance = cumDist;
  const totalTime = cumTime;

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const daysStr =
    selectedDays.size > 0 ? [...selectedDays].join(", ") : null;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <Text variant="headline" className="mb-1">
        {name || "Untitled Training"}
      </Text>
      <Text variant="body-sm" className="text-foreground-muted">
        {[daysStr, formattedDate].filter(Boolean).join(" · ")}
      </Text>
      {teamName && (
        <Text variant="body-sm" className="text-foreground-secondary mt-1">
          {teamName}
        </Text>
      )}
      {notes && (
        <Text variant="body-sm" className="text-foreground-muted italic mt-1">
          {notes}
        </Text>
      )}

      <Divider className="my-3" />

      {/* Exercise section */}
      <View className="flex-row items-center justify-between mb-2">
        <Text variant="title">Exercises</Text>
        <Text variant="body-sm" className="text-foreground-muted">
          {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Column headers */}
      {exercises.length > 0 && (
        <View className="flex-row items-center px-3 mb-1">
          <View className="flex-1" />
          <Text variant="label-sm" className="opacity-60 w-16 text-right">
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
          exercise={{ ...ex, confirmed: true }}
          index={i}
          unit={unit}
          exerciseNames={[]}
          rollingDistance={rollingTotals[i]?.rollingDistance ?? 0}
          rollingTime={rollingTotals[i]?.rollingTime ?? 0}
          errors={{}}
          onUpdate={() => {}}
          onConfirm={() => {}}
          onDelete={() => {}}
          readOnly
        />
      ))}

      {/* Footer totals */}
      <Divider className="my-2" />
      <View className="flex-row items-center justify-end gap-6 px-3">
        <View className="items-end">
          <Text variant="label-sm" className="opacity-60">
            Total Distance
          </Text>
          <Text className="font-semibold">{totalDistance}</Text>
        </View>
        <View className="items-end">
          <Text variant="label-sm" className="opacity-60">
            Total Time
          </Text>
          <Text className="font-semibold">
            {totalTime > 0 ? formatTime(totalTime) : "--"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
