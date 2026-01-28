import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Link } from "expo-router";

// Expo Renders Layout file by default
// Slot: Renders page content
// Stack: Renders page +  keeps the previous pages stored
const RootLayout = () => {
  // Use Stack Screen to setup the screen
  // headerShown = False to hide header on a page
  // Options>Title: name to set custom title
  return (
    <View style={{ flex: 1}}>
      {/* Screen Options: Global Options for all screens */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ddd" },
          headerTintColor: "#333",
        }}
      >
        {/* Reister screen with file name index, title=Home, */}
        <Stack.Screen name="index" options={{ title: "Home" }}></Stack.Screen>
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
    </View>
  );
};

// Use headshown: false to hide it

export default RootLayout;

const styles = StyleSheet.create({});
