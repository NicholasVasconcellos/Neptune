import {
  StyleSheet,
  View,
  Pressable,
  useColorScheme,
  ScrollView,
  Touchable,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors, typography, spacing } from "../../Styles/Theme";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ThemedInput from "../../components/ThemedInput";

// Supabase Data Submit
import { supabase } from "../../lib/supabase";

const dataTypes = [
  { key: "time", label: "Time", icon: "stopwatch", set: "fa6" },
  { key: "swimmer", label: "Swimmer", icon: "swimmer", set: "fa5" },
  { key: "training", label: "Training", icon: "dumbbell", set: "fa6" },
];

export default function addData() {
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];
  const [selected, setSelected] = useState(null);

  // State Variables
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");
  const [team, setTeam] = useState("");

  const [loading, setLoading] = useState(false);

  // Add user Function
  async function addUser() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Athletes")
      .insert([{ Name: name, Age: age }])
      .select();
    // .select to return the new row if success

    if (error) {
      if (Platform.OS === "web") {
        window.alert("Error Adding bro" + error.message);
      } else {
        Alert.alert("Error Adding bro", error.message);
      }
    } else if (data) {
      if (Platform.OS === "web") {
        window.alert("Added " + name);
      } else {
        Alert.alert("Added ", name);
      }

      setName("");
      setAge("");
    }
    setLoading(false);
  }

  const [tablename, setTablename] = useState("");

  return (
    <TouchableWithoutFeedback>
      <ScrollView>
        <ThemedText>Name</ThemedText>
        <ThemedInput
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        ></ThemedInput>
        <ThemedText>Age</ThemedText>
        <ThemedInput
          placeholder="Enter Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        ></ThemedInput>

        <Button onClick={addUser} disabled={loading}>
          {" "}
          Submit
        </Button>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  heading: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: typography.sizes.md,
    marginBottom: spacing.xl,
    opacity: 0.7,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  gridItemSelected: {
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.5,
  },
  gridLabel: {
    fontSize: typography.sizes.l,
    fontWeight: typography.weights.semibold,
  },
});
