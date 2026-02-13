import {
  StyleSheet,
  View,
  Pressable,
  useColorScheme,
  ScrollView,
  Touchable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";

// Styles
import { Colors, typography, spacing } from "../../Styles/Theme";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// My components
import Title from "../../components/Title";
import ThemedInput from "../../components/ThemedInput";
import Typeahead from "../../components/Typeahead";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";

// Supabase Data Submit
import { supabase } from "../../lib/supabase";
import { alertLog } from "../../utils/alertLog";

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

  // Get Data form Supabase table into array
  // Error from backend
  const [error, setError] = useState(null);
  // Data from backend
  const [objectArray, setObjectArray] = useState([]);

  // Get table data
  async function getData() {

    
    setLoading(true);

    // Get Logged in User ID
    const user = (await supabase.auth.getUser()).data.user;

    if(!user){
      setLoading(false);
      
    }

    const { data, error } = await supabase.from("Athletes").select();

    if (error) {
      alertLog("Couldn't get Data Bro:", error.message);
    } else if (data) {
      alertLog("Array Fetched", name);

      setObjectArray(data.Name);
    }

    setLoading(false);
  }


  // Add user Function
  async function addUser() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Athletes")
      .insert([{ Name: name, Age: age }])
      .select();
    // .select to return the new row if success

    if (error) {
      alertLog("Error Adding bro", error.message);
    } else if (data) {
      alertLog("Added", name);

      setName("");
      setAge("");
    }
    setLoading(false);
  }

  const [tablename, setTablename] = useState("");

  // Test Typeahead
  const names = [
    "Nick",
    "Bre",
    "Vic",
    "Mar",
    "Alex",
    "Alexa",
    "Alexander",
    "Alicia",
    "Allison",
    "Ben",
    "Benjamin",
    "Bella",
    "Brandon",
    "Brianna",
    "Caleb",
    "Cameron",
    "Carlos",
    "Carla",
    "Catherine",
    "Daniel",
    "Danielle",
    "David",
    "Diana",
    "Dominic",
    "Eli",
    "Elijah",
    "Emma",
    "Emily",
    "Ethan",
    "Felix",
    "Fiona",
    "Frank",
    "Faith",
    "Gabriel",
    "Gabriella",
    "George",
    "Grace",
    "Hannah",
    "Henry",
    "Hector",
    "Hailey",
    "Isaac",
    "Isabella",
    "Ian",
    "Ivy",
    "Jack",
    "Jackson",
    "Jacob",
    "Jasmine",
    "Julia",
    "Kevin",
    "Katherine",
    "Kyle",
    "Kylie",
    "Liam",
    "Lucas",
    "Luna",
    "Lily",
    "Logan",
    "Mason",
    "Mia",
    "Michael",
    "Mila",
    "Matthew",
    "Noah",
    "Natalie",
    "Nathan",
    "Nora",
    "Olivia",
    "Owen",
    "Oscar",
    "Paul",
    "Paula",
    "Peter",
    "Penelope",
    "Quinn",
    "Ryan",
    "Rachel",
    "Robert",
    "Rose",
    "Samuel",
    "Sophia",
    "Sebastian",
    "Scarlett",
    "Thomas",
    "Taylor",
    "Tristan",
    "Tara",
    "Uriel",
    "Victor",
    "Vanessa",
    "William",
    "Willow",
    "Xavier",
    "Yara",
    "Zachary",
    "Zoe",
  ];

  return (
    // <TouchableWithoutFeedback>
    //   <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
    //     <ThemedText>Name</ThemedText>
    //     <ThemedInput
    //       placeholder="Enter Name"
    //       value={name}
    //       onChangeText={setName}
    //     ></ThemedInput>
    //     <ThemedText>Age</ThemedText>
    //     <ThemedInput
    //       placeholder="Enter Age"
    //       keyboardType="numeric"
    //       value={age}
    //       onChangeText={setAge}
    //     ></ThemedInput>

    //     <Button onClick={addUser} disabled={loading}>
    //       {" "}
    //       Submit
    //     </Button>
    //   </ScrollView>
    // </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
        <Title>Add your Data</Title>
        <Typeahead
          formTitle={"My Typeahed Form"}
          array={names}
          placeholderText={"blablabla..."}
        ></Typeahead>
        <Typeahead
          formTitle={"Second Form"}
          array={names}
          placeholderText={"blablabla..."}
        ></Typeahead>
      </View>
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
