import { StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import ThemedText from "../../components/ThemedText";
import { Colors } from "../../Styles/Theme";

// Icons
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

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
          contentStyle: { backgroundColor: "red" },
          tabBarActiveTintColor: Colors.primary,
          tabBarStyle:{backgroundColor: theme.background}
        }}
      >
        {/* Reister screen with file name index, title=Home, */}
        <Tabs.Screen name="index" options={{ title: "Home" }}></Tabs.Screen>
        <Tabs.Screen
          name="addData"
          options={{
            title: "Log Data",
            tabBarIcon: ({focused}) => (
              <FontAwesome6 name="add" size={24} color={focused ? Colors.primary : theme.text} />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="viewData"
          options={{
            title: "View Metrics",
            tabBarIcon: ({focused}) => (
              <FontAwesome6 name="chart-line" size={24} color={focused ? Colors.primary : theme.text} />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="addTraining"
          options={{
            title: "Add New Training",
            tabBarIcon: ({focused}) => (
              <FontAwesome6 name="scroll" size={24} color={focused ? Colors.primary : theme.text} />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="viewTraining"
          options={{
            title: "Start Training",
            tabBarIcon: ({focused}) => (
              <FontAwesome6 name="play" size={24} color={focused ? Colors.primary : theme.text} />
            ),
          }}
        ></Tabs.Screen>
      </Tabs>
    </View>
  );
};

// Use headshown: false to hide it

export default RootLayout;

// const styles = StyleSheet.create({
// });
