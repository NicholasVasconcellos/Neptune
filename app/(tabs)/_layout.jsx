import { StyleSheet, Text, View,useColorScheme } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import ThemedText from "../../Components/ThemedText";
import { Colors } from "../../Styles/Theme";


// Expo Renders Layout file by default
// Slot: Renders page content
// Tabs: Renders page +  keeps the previous pages stored
const RootLayout = () => {

  // Use Tabs Screen to setup the screen
  // headerShown = False to hide header on a page
  // Options>Title: name to set custom title


  // Get Color scheme

  const theme = Colors[useColorScheme()] || Colors.light;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Screen Options: Global Options for all screens */}
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.backgroundSecondary },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: "#000" },
          tabBarActiveTintColor: Colors.primary

        }}
      >
        {/* Reister screen with file name index, title=Home, */}
        <Tabs.Screen name="index" options={{ title: "Home" }}></Tabs.Screen>
        <Tabs.Screen
          name="addData"
          options={{ title: "Log Data" }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="viewData"
          options={{ title: "View Metrics" }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="addTraining"
          options={{ title: "Add New Training" }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="viewTraining"
          options={{ title: "Start Training" }}
        ></Tabs.Screen>
      </Tabs>
    </View>
  );
};

// Use headshown: false to hide it

export default RootLayout;

// const styles = StyleSheet.create({
// });
