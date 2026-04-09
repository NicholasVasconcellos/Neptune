import { View } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, TextInput, Button, SegmentedControl, Snackbar } from "@/components/ui";
import Typeahead from "@/components/Typeahead";
import { useThemeColors } from "@/hooks/useThemeColors";
import { postData } from "@/utils/backendData";
import { useData } from "@/context/DataContext";
import { parseTimeToSeconds, cleanTimeInput } from "@/utils/timeFormatting";
import {
  SWIM_STROKES,
  SWIM_DISTANCES,
} from "@/constants/swimmingConstants";

interface TimeFormProps {
  onSuccess?: (msg: string) => void;
  initialAthleteId?: number;
  initialAthleteName?: string;
}

export default function TimeForm({ onSuccess, initialAthleteId, initialAthleteName }: TimeFormProps = {}) {
  const colors = useThemeColors();
  const { athletes: athleteData } = useData();
  const [athleteId, setAthleteId] = useState<number | null>(initialAthleteId ?? null);
  const [athleteName, setAthleteName] = useState(initialAthleteName ?? "");
  const [stroke, setStroke] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("meters");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [localStrokes, setLocalStrokes] = useState<string[]>([
    ...SWIM_STROKES,
  ]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [swimmerError, setSwimmerError] = useState("");
  const [strokeError, setStrokeError] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function handleTimeChange(text: string) {
    setTime(cleanTimeInput(text));
  }

  const strokeData = localStrokes.map((s, idx) => ({ id: idx, Name: s }));
  const distanceData = (SWIM_DISTANCES as Record<string, number[]>)[
    distanceUnit
  ].map((d: number) => ({
    id: d,
    Name: String(d),
  }));

  const athletePreset = initialAthleteId != null;

  function handleStrokeSelect(item: Record<string, any>) {
    setStroke(item.Name);
  }

  function handleStrokeChange(text: string) {
    setStroke(text);
    if (
      text.trim() &&
      !localStrokes.some(
        (s) => s.toLowerCase() === text.trim().toLowerCase(),
      )
    ) {
      setLocalStrokes((prev) => [...prev, text.trim()]);
    }
  }

  function resetForm() {
    setTime("");
    setStroke("");
    setDistance("");
    if (!athletePreset) {
      setAthleteId(null);
      setAthleteName("");
    }
    setSwimmerError("");
    setStrokeError("");
    setDistanceError("");
    setTimeError("");
  }

  async function handleSubmit() {
    setSwimmerError("");
    setStrokeError("");
    setDistanceError("");
    setTimeError("");

    let hasError = false;

    if (athleteId === null) {
      setSwimmerError("Swimmer is required");
      hasError = true;
    }

    if (!stroke.trim()) {
      setStrokeError("Stroke is required");
      hasError = true;
    }

    if (!distance.trim()) {
      setDistanceError("Distance is required");
      hasError = true;
    }

    if (!time.trim()) {
      setTimeError("Time is required");
      hasError = true;
    } else if (parseTimeToSeconds(time) === null || parseTimeToSeconds(time)! <= 0) {
      setTimeError("Invalid time — use MM:SS.ms or seconds");
      hasError = true;
    }

    if (hasError) return;

    const timeRecord: Record<string, any> = {
      Time: parseTimeToSeconds(time)!,
      Distance: Number(distance),
      "Distance Unit": distanceUnit,
      Stroke: stroke.trim(),
      "Athlete ID": athleteId,
    };

    setSubmitLoading(true);
    try {
      await postData("Times", timeRecord);
      const msg = "Successfully added time";
      if (onSuccess) {
        onSuccess(msg);
      } else {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
      }
      resetForm();
    } catch (e: any) {
      setTimeError(e.message ?? "An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <View className="p-3 gap-1">
        <Text variant="headline" className="text-center mt-4 mb-2">
          New Time
        </Text>

        {!athletePreset && (
          <>
            <Typeahead
              array={athleteData}
              propertyName="Name"
              formTitle="Swimmer"
              placeholderText="Search for swimmer"
              value={athleteName}
              allowsNew={false}
              showOnEmpty={false}
              onChangeText={(text) => {
                setAthleteName(text);
                setAthleteId(null);
              }}
              onSelect={(item) => {
                setAthleteName(item.Name);
                setAthleteId(item.id);
              }}
            />
            {!!swimmerError && (
              <Text variant="body-sm" className="text-danger ml-1">
                {swimmerError}
              </Text>
            )}
          </>
        )}

        <Typeahead
          array={strokeData}
          propertyName="Name"
          formTitle="Stroke"
          placeholderText="Select or add stroke"
          value={stroke}
          allowsNew
          showOnEmpty
          onChangeText={handleStrokeChange}
          onSelect={handleStrokeSelect}
        />
        {!!strokeError && (
          <Text variant="body-sm" className="text-danger ml-1">
            {strokeError}
          </Text>
        )}

        <SegmentedControl
          options={[
            { value: "meters", label: "Meters" },
            { value: "yards", label: "Yards" },
          ]}
          selected={distanceUnit}
          onChange={setDistanceUnit}
          className="my-2"
        />

        <Typeahead
          array={distanceData}
          propertyName="Name"
          formTitle="Distance"
          placeholderText="Select or enter distance"
          value={distance}
          allowsNew
          showOnEmpty
          onChangeText={setDistance}
          onSelect={(item) => setDistance(item.Name)}
        />
        {!!distanceError && (
          <Text variant="body-sm" className="text-danger ml-1">
            {distanceError}
          </Text>
        )}

        <TextInput
          label="Time (MM:SS.ms)"
          placeholder="e.g. 1:30.22 or 90"
          value={time}
          onChangeText={handleTimeChange}
          keyboardType="decimal-pad"
          error={!!timeError}
          errorMessage={timeError}
        />

        <Button
          onPress={handleSubmit}
          disabled={submitLoading}
          loading={submitLoading}
          icon={<Ionicons name="timer-outline" size={18} color={colors.onPrimary} />}
        >
          Add Time
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
