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

// Backend Data Utils
import { getData, postData } from "../../utils/backendData";
import { alertLog } from "../../utils/alertLog";

const dataTypes = [
  { key: "time", label: "Time", icon: "stopwatch", set: "fa6" },
  { key: "swimmer", label: "Swimmer", icon: "swimmer", set: "fa5" },
  { key: "training", label: "Training", icon: "dumbbell", set: "fa6" },
];

export default function addData() {
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];
  const [selected, setSelected] = useState<string | null>(null);

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
    { Name: "Nick" },
    { Name: "Bre" },
    { Name: "Vic" },
    { Name: "Mar" },
    { Name: "Alex" },
    { Name: "Alexa" },
    { Name: "Alexander" },
    { Name: "Alicia" },
    { Name: "Allison" },
    { Name: "Ben" },
    { Name: "Benjamin" },
    { Name: "Bella" },
    { Name: "Brandon" },
    { Name: "Brianna" },
    { Name: "Caleb" },
    { Name: "Cameron" },
    { Name: "Carlos" },
    { Name: "Carla" },
    { Name: "Catherine" },
    { Name: "Daniel" },
    { Name: "Danielle" },
    { Name: "David" },
    { Name: "Diana" },
    { Name: "Dominic" },
    { Name: "Eli" },
    { Name: "Elijah" },
    { Name: "Emma" },
    { Name: "Emily" },
    { Name: "Ethan" },
    { Name: "Felix" },
    { Name: "Fiona" },
    { Name: "Frank" },
    { Name: "Faith" },
    { Name: "Gabriel" },
    { Name: "Gabriella" },
    { Name: "George" },
    { Name: "Grace" },
    { Name: "Hannah" },
    { Name: "Henry" },
    { Name: "Hector" },
    { Name: "Hailey" },
    { Name: "Isaac" },
    { Name: "Isabella" },
    { Name: "Ian" },
    { Name: "Ivy" },
    { Name: "Jack" },
    { Name: "Jackson" },
    { Name: "Jacob" },
    { Name: "Jasmine" },
    { Name: "Julia" },
    { Name: "Kevin" },
    { Name: "Katherine" },
    { Name: "Kyle" },
    { Name: "Kylie" },
    { Name: "Liam" },
    { Name: "Lucas" },
    { Name: "Luna" },
    { Name: "Lily" },
    { Name: "Logan" },
    { Name: "Mason" },
    { Name: "Mia" },
    { Name: "Michael" },
    { Name: "Mila" },
    { Name: "Matthew" },
    { Name: "Noah" },
    { Name: "Natalie" },
    { Name: "Nathan" },
    { Name: "Nora" },
    { Name: "Olivia" },
    { Name: "Owen" },
    { Name: "Oscar" },
    { Name: "Paul" },
    { Name: "Paula" },
    { Name: "Peter" },
    { Name: "Penelope" },
    { Name: "Quinn" },
    { Name: "Ryan" },
    { Name: "Rachel" },
    { Name: "Robert" },
    { Name: "Rose" },
    { Name: "Samuel" },
    { Name: "Sophia" },
    { Name: "Sebastian" },
    { Name: "Scarlett" },
    { Name: "Thomas" },
    { Name: "Taylor" },
    { Name: "Tristan" },
    { Name: "Tara" },
    { Name: "Uriel" },
    { Name: "Victor" },
    { Name: "Vanessa" },
    { Name: "William" },
    { Name: "Willow" },
    { Name: "Xavier" },
    { Name: "Yara" },
    { Name: "Zachary" },
    { Name: "Zoe" },
  ];
  return (
    <Pressable onPress={() => Platform.OS !== "web" && Keyboard.dismiss()} accessible={false}>
      <View>
        <Title>Add your Data</Title>
        <Typeahead
          formTitle={"My Typeahed Form"}
          array={names}
          propertyName={"Name"}
          placeholderText={"blablabla..."}
        ></Typeahead>
        <Typeahead
          formTitle={"Second Form"}
          array={names}
          propertyName={"Name"}
          placeholderText={"blablabla..."}
        ></Typeahead>
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
