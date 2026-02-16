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
  const [time, setTime] = useState("");
  const [stroke, setStroke] = useState("");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("yards");
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [athleteName, setAthleteName] = useState("");

  const [athleteData, setAthleteData] = useState<Record<string, any>[]>([]);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [timeError, setTimeError] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [athleteError, setAthleteError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const strokeData = SWIM_STROKES.map((s, idx) => ({ id: idx, Name: s }));
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
        setAthleteError("Failed to load athletes");
      } finally {
        setAthleteLoading(false);
      }
    }
    fetchAthletes();
  }, []);

  function resetForm() {
    setTime("");
    setStroke("");
    setDistance("");
    setAthleteId(null);
    setAthleteName("");
  }

  async function handleSubmit() {
    setTimeError("");
    setDistanceError("");
    setAthleteError("");

    let hasError = false;

    if (!time.trim()) {
      setTimeError("Time is required");
      hasError = true;
    } else if (isNaN(Number(time)) || Number(time) <= 0) {
      setTimeError("Time must be a positive number");
      hasError = true;
    }

    if (!distance.trim()) {
      setDistanceError("Distance is required");
      hasError = true;
    }

    if (hasError) return;

    const timeRecord: Record<string, any> = {
      Time: Number(time),
      Distance: Number(distance),
      "Distance Unit": distanceUnit,
    };

    if (stroke.trim()) timeRecord.Stroke = stroke.trim();
    if (athleteId !== null) timeRecord["Athlete ID"] = athleteId;

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

          <Typeahead
            array={strokeData}
            propertyName="Name"
            formTitle="Stroke"
            placeholderText="Select stroke (optional)"
            value={stroke}
            onChangeText={setStroke}
            onSelect={(item) => setStroke(item.Name)}
          />

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
            onChangeText={setDistance}
            onSelect={(item) => setDistance(item.Name)}
          />
          <HelperText type="error" visible={!!distanceError}>
            {distanceError}
          </HelperText>

          <Typeahead
            array={athleteData}
            propertyName="Name"
            formTitle="Athlete"
            placeholderText="Select athlete (optional)"
            loading={athleteLoading}
            value={athleteName}
            onSelect={(item) => {
              setAthleteName(item.Name);
              setAthleteId(item.id);
            }}
          />
          <HelperText type="error" visible={!!athleteError}>
            {athleteError}
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
