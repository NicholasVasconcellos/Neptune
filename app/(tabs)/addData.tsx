import {
  StyleSheet,
  View,
  useColorScheme,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";

// Styles
import { Colors, typography, spacing } from "../../Styles/Theme";

// My components
import Title from "../../components/Title";
import Typeahead from "../../components/Typeahead";
import UnitToggle from "../../components/UnitToggle";
import Button from "../../components/Button";
import ButtonGrid from "../../components/ButtonGrid";

// Backend Data Utils
import { getData, postData } from "../../utils/backendData";
import { alertLog } from "../../utils/alertLog";

const dataTypes = [
  { key: "time", label: "Time", icon: "stopwatch", set: "fa6" as const },
  { key: "swimmer", label: "Swimmer", icon: "swimmer", set: "fa5" as const },
  { key: "training", label: "Training", icon: "dumbbell", set: "fa6" as const },
];

export default function addData() {
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];
  const [selected, setSelected] = useState<string[]>([]);

  // State Variables
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");
  const [team, setTeam] = useState("");

  const [loading, setLoading] = useState(false);

  // Get Data form Supabase table into array
  // Error from backend
  const [error, setError] = useState<string | null>(null);
  // Data from backend
  const [objectArray, setObjectArray] = useState<any[]>([]);

  // Get table data
  async function fetchData(tableName: string) {
    setLoading(true);
    try {
      const data = await getData(tableName);
      setObjectArray(data);
      alertLog("Array Fetched", tableName);
    } catch (e: any) {
      alertLog("Couldn't get Data Bro:", e.message);
    }
    setLoading(false);
  }

  // Add data to table
  async function submitData(tableName: string, object: Record<string, any>) {
    setLoading(true);
    try {
      await postData(tableName, object);
      alertLog("Added", name);
      setName("");
      setAge("");
    } catch (e: any) {
      alertLog("Error Adding bro", e.message);
    }
    setLoading(false);
  }

  // Test Typeahead
  const names = [
    { id: 1, Name: "Nick" },
    { id: 2, Name: "Bre" },
    { id: 3, Name: "Vic" },
    { id: 4, Name: "Mar" },
    { id: 5, Name: "Alex" },
    { id: 6, Name: "Alexa" },
    { id: 7, Name: "Alexander" },
    { id: 8, Name: "Alicia" },
    { id: 9, Name: "Allison" },
    { id: 10, Name: "Ben" },
    { id: 11, Name: "Benjamin" },
    { id: 12, Name: "Bella" },
    { id: 13, Name: "Brandon" },
    { id: 14, Name: "Brianna" },
    { id: 15, Name: "Caleb" },
    { id: 16, Name: "Cameron" },
    { id: 17, Name: "Carlos" },
    { id: 18, Name: "Carla" },
    { id: 19, Name: "Catherine" },
    { id: 20, Name: "Daniel" },
    { id: 21, Name: "Danielle" },
    { id: 22, Name: "David" },
    { id: 23, Name: "Diana" },
    { id: 24, Name: "Dominic" },
    { id: 25, Name: "Eli" },
    { id: 26, Name: "Elijah" },
    { id: 27, Name: "Emma" },
    { id: 28, Name: "Emily" },
    { id: 29, Name: "Ethan" },
    { id: 30, Name: "Felix" },
    { id: 31, Name: "Fiona" },
    { id: 32, Name: "Frank" },
    { id: 33, Name: "Faith" },
    { id: 34, Name: "Gabriel" },
    { id: 35, Name: "Gabriella" },
    { id: 36, Name: "George" },
    { id: 37, Name: "Grace" },
    { id: 38, Name: "Hannah" },
    { id: 39, Name: "Henry" },
    { id: 40, Name: "Hector" },
    { id: 41, Name: "Hailey" },
    { id: 42, Name: "Isaac" },
    { id: 43, Name: "Isabella" },
    { id: 44, Name: "Ian" },
    { id: 45, Name: "Ivy" },
    { id: 46, Name: "Jack" },
    { id: 47, Name: "Jackson" },
    { id: 48, Name: "Jacob" },
    { id: 49, Name: "Jasmine" },
    { id: 50, Name: "Julia" },
    { id: 51, Name: "Kevin" },
    { id: 52, Name: "Katherine" },
    { id: 53, Name: "Kyle" },
    { id: 54, Name: "Kylie" },
    { id: 55, Name: "Liam" },
    { id: 56, Name: "Lucas" },
    { id: 57, Name: "Luna" },
    { id: 58, Name: "Lily" },
    { id: 59, Name: "Logan" },
    { id: 60, Name: "Mason" },
    { id: 61, Name: "Mia" },
    { id: 62, Name: "Michael" },
    { id: 63, Name: "Mila" },
    { id: 64, Name: "Matthew" },
    { id: 65, Name: "Noah" },
    { id: 66, Name: "Natalie" },
    { id: 67, Name: "Nathan" },
    { id: 68, Name: "Nora" },
    { id: 69, Name: "Olivia" },
    { id: 70, Name: "Owen" },
    { id: 71, Name: "Oscar" },
    { id: 72, Name: "Paul" },
    { id: 73, Name: "Paula" },
    { id: 74, Name: "Peter" },
    { id: 75, Name: "Penelope" },
    { id: 76, Name: "Quinn" },
    { id: 77, Name: "Ryan" },
    { id: 78, Name: "Rachel" },
    { id: 79, Name: "Robert" },
    { id: 80, Name: "Rose" },
    { id: 81, Name: "Samuel" },
    { id: 82, Name: "Sophia" },
    { id: 83, Name: "Sebastian" },
    { id: 84, Name: "Scarlett" },
    { id: 85, Name: "Thomas" },
    { id: 86, Name: "Taylor" },
    { id: 87, Name: "Tristan" },
    { id: 88, Name: "Tara" },
    { id: 89, Name: "Uriel" },
    { id: 90, Name: "Victor" },
    { id: 91, Name: "Vanessa" },
    { id: 92, Name: "William" },
    { id: 93, Name: "Willow" },
    { id: 94, Name: "Xavier" },
    { id: 95, Name: "Yara" },
    { id: 96, Name: "Zachary" },
    { id: 97, Name: "Zoe" },
  ];
  return (
    // Grid of Buttons
    // ONe button for each object type
    // Each object type has a list of fields (with either req or not req options)
    // Map each list of fields to a form of that type, or a custom component specified by it

    // Form Layout (multiple form inputs)
    // Populate with components mapped by the actively selected buttons
    // if required and missing data display message
    // Helper Text component (react native paper)

    // Submit Button
    // Display the Error mess
    <Pressable
      onPress={() => Platform.OS !== "web" && Keyboard.dismiss()}
      accessible={false}
    >
      <View>
        <Title>Add your Data</Title>
        <ButtonGrid
          items={dataTypes}
          selected={selected}
          onSelectionChange={setSelected}
        />
        <Typeahead
          formTitle={"Athlete"}
          array={names}
          propertyName={"Name"}
          placeholderText={"Enter Name"}
        ></Typeahead>
        <Typeahead
          formTitle={"Time"}
          array={names}
          propertyName={"Name"}
          placeholderText={"Enter Time"}
        ></Typeahead>
        <UnitToggle></UnitToggle>
        <Button>Submit</Button>
      </View>
    </Pressable>
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
});
