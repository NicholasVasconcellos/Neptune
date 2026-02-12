import {
  StyleSheet,
  View,
  Pressable,
  useColorScheme,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Colors, typography, spacing } from "../../Styles/Theme";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ThemedInput from "../../components/ThemedInput";

// Supabase Data Submit
import { supabase } from "./supabase";

const dataTypes = [
  { key: "time", label: "Time", icon: "stopwatch", set: "fa6" },
  { key: "swimmer", label: "Swimmer", icon: "swimmer", set: "fa5" },
  { key: "training", label: "Training", icon: "dumbbell", set: "fa6" },
];


async function addUser(name, age, team="", group=""){

}



const addData = () => {
  const themeName = useColorScheme();
  const theme = Colors[themeName ?? "light"];
  const [selected, setSelected] = useState(null);

  // Variables For the Input

  const [name, setName] = useState("");
  const [age, setAge] = useState(null);
  const [timeEntry, setTimeEntry] = useState("");
  const [unitEntry, setUnitEntry] = useState("");
  const [group, setGroup] = useState("");
  const [team, setTeam] = useState("");
  const [distance, setDistance] = useState(null);
  const [stroke, setStroke] = useState("");

  // Variables to Track which objects are being created
  const [newUser, setNewUser] = useState(false);
  const [newTime, setNewTime] = useState(false);
  const [newTeam, setNewTeam] = useState(false);
  const [newGroup, setNewGroup] = useState(false);

  // if setNew User
  // Display forms:
  // Name, Age, Team (optional), Group (Optional)
  // if setNewTime
  // Render Forms:
  // Name, stroke,distance, unit, time

  // Button Callback, add new User
  //

  

  const [tablename, setTablename] = useState("");
    const {data,error} = await supabase.from("Athletes").insert([
      {Name: name },{Age: age}
    ])
  return (
    <ScrollView>
      <ThemedText>Enter User</ThemedText>
      <ThemedInput placeholder="Type Here"></ThemedInput>
    </ScrollView>

    // <View style={[styles.container, { backgroundColor: theme.background }]}>
    //   <ThemedText style={styles.heading}>Add Data</ThemedText>
    //   <ThemedText style={styles.subheading}>Select a category</ThemedText>

    //   <View style={styles.grid}>
    //     {dataTypes.map((item) => (
    //       <Pressable
    //         key={item.key}
    //         onPress={() => setSelected(item.key)}
    //         style={({ pressed }) => [
    //           styles.gridItem,
    //           { backgroundColor: theme.backgroundCard },
    //           selected === item.key && styles.gridItemSelected,
    //           pressed && styles.pressed,
    //         ]}
    //       >
    //         {item.set === "fa5" ? (
    //           <FontAwesome5 name={item.icon} size={36} color={selected === item.key ? Colors.primary : theme.text} />
    //         ) : (
    //           <FontAwesome6 name={item.icon} size={36} color={selected === item.key ? Colors.primary : theme.text} />
    //         )}
    //         <ThemedText style={styles.gridLabel}>{item.label}</ThemedText>
    //       </Pressable>
    //     ))}
    //   </View>

    //   {/* After selecting Icons, will selectively populate input forms */}
    //   {/* input forms will have typeahead, and will detect when an entry is new and put a "new" tag */}
    //   {/* if Creating a new object, any required fields will be further populated as dropdown */}
    //   {/* Upon Form submission Log message appears to say Created blablabla */}

    //   <Button href={"/"}>Back Home</Button>
    // </View>
  );
};

export default addData;

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
