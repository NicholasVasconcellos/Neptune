import { StyleSheet, View, Pressable, Keyboard, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { HelperText, Snackbar, SegmentedButtons } from "react-native-paper";

import Title from "../Title";
import ThemedInput from "../ThemedInput";
import Typeahead from "../Typeahead";
import Button from "../Button";
import { getData, postData } from "../../utils/backendData";
import {
  SWIM_STROKES,
  SWIM_DISTANCES,
} from "../../constants/swimmingConstants";

export default function TimeForm() {
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [athleteName, setAthleteName] = useState("");
  const [stroke, setStroke] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("yards");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const [athleteData, setAthleteData] = useState<Record<string, any>[]>([]);
  const [localStrokes, setLocalStrokes] = useState<string[]>([...SWIM_STROKES]);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [swimmerError, setSwimmerError] = useState("");
  const [strokeError, setStrokeError] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const strokeData = localStrokes.map((s, idx) => ({ id: idx, Name: s }));
  const distanceData = (
    SWIM_DISTANCES as Record<string, number[]>
  )[distanceUnit].map((d: number) => ({
    id: d,
    Name: String(d),
  }));

  useEffect(() => {
    async function fetchAthletes() {
      setAthleteLoading(true);
      try {
        setAthleteData(await getData("Athletes"));
      } catch (e: any) {
        setSwimmerError("Failed to load athletes");
      } finally {
        setAthleteLoading(false);
      }
    }
    fetchAthletes();
  }, []);

  function handleStrokeSelect(item: Record<string, any>) {
    setStroke(item.Name);
  }

  function handleStrokeChange(text: string) {
    setStroke(text);
    // If the user typed a new stroke that doesn't exist, add it to local array
    if (
      text.trim() &&
      !localStrokes.some((s) => s.toLowerCase() === text.trim().toLowerCase())
    ) {
      setLocalStrokes((prev) => [...prev, text.trim()]);
    }
  }

  function resetForm() {
    setTime("");
    setStroke("");
    setDistance("");
    setAthleteId(null);
    setAthleteName("");
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
    } else if (isNaN(Number(time)) || Number(time) <= 0) {
      setTimeError("Time must be a positive number");
      hasError = true;
    }

    if (hasError) return;

    const timeRecord: Record<string, any> = {
      Time: Number(time),
      Distance: Number(distance),
      "Distance Unit": distanceUnit,
      Stroke: stroke.trim(),
      "Athlete ID": athleteId,
    };

    setSubmitLoading(true);
    try {
      await postData("Times", timeRecord);
      setSnackbarMessage("Successfully added time");
      setSnackbarVisible(true);
      resetForm();
    } catch (e: any) {
      setTimeError(e.message ?? "An error occurred");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <Pressable
        onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
        accessible={false}
      >
        <View style={styles.container}>
          <Title>New Time</Title>

          <Typeahead
            array={athleteData}
            propertyName="Name"
            formTitle="Swimmer"
            placeholderText="Search for swimmer"
            loading={athleteLoading}
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
          <HelperText type="error" visible={!!swimmerError}>
            {swimmerError}
          </HelperText>

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
          <HelperText type="error" visible={!!strokeError}>
            {strokeError}
          </HelperText>

          <SegmentedButtons
            style={styles.unitToggle}
            value={distanceUnit}
            onValueChange={setDistanceUnit}
            buttons={[
              { value: "yards", label: "Yards" },
              { value: "meters", label: "Meters" },
            ]}
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
          <HelperText type="error" visible={!!distanceError}>
            {distanceError}
          </HelperText>

          <ThemedInput
            formTitle="Time (seconds)"
            placeholder="Enter time in seconds"
            value={time}
            onChangeText={setTime}
            keyboardType="decimal-pad"
          />
          <HelperText type="error" visible={!!timeError}>
            {timeError}
          </HelperText>

          <Button
            onClick={handleSubmit}
            disabled={submitLoading}
            loading={submitLoading}
            icon="timer"
          >
            Add Time
          </Button>
        </View>
      </Pressable>

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
  unitToggle: {
    marginVertical: 8,
  },
});
