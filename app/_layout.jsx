import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Link } from "expo-router";

// Expo Renders Layout file by default
// Slot: Renders page content
// Stack: Renders page +  keeps the previous pages stored
const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ title: "Home" }}></Stack.Screen>
      <Stack.Screen
        name="addData"
        options={{ title: "Log Data" }}
      ></Stack.Screen>
      <Stack.Screen
        name="viewData"
        options={{ title: "View Metrics" }}
      ></Stack.Screen>
      <Stack.Screen
        name="addTraining"
        options={{ title: "Add New Training" }}
      ></Stack.Screen>
      <Stack.Screen
        name="viewTraining"
        options={{ title: "Start Training" }}
      ></Stack.Screen>
    </Stack>
  );
};

// Use headshown: false to hide it

export default RootLayout;

const styles = StyleSheet.create({});
