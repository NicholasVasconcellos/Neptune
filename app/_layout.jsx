import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Stack } from "expo-router";
import ThemedText from "../components/ThemedText";
import { Colors } from "../Styles/Theme";

// Expo Renders Layout file by default
// Slot: Renders page content
// Stack: Renders page +  keeps the previous pages stored
const RootLayout = () => {
  const themeName = useColorScheme();

  const currTheme = Colors[themeName] || Colors.light;

  // Use Stack Screen to setup the screen
  // headerShown = False to hide header on a page
  // Options>Title: name to set custom title
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: currTheme.background }}>
        {/* Screen Options: Global Options for all screens */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: currTheme.background },
          }}
        >
          {/* Reister screen with file name index, title=Home, */}
          <Stack.Screen
            name="(auth)/login"
            options={{ title: "Login" }}
          ></Stack.Screen>
          <Stack.Screen
            name="(auth)/register"
            options={{ title: "Create Account" }}
          ></Stack.Screen>
        </Stack>
        {/* <ThemedText>Footer </ThemedText> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Use headshown: false to hide it

export default RootLayout;

// const styles = StyleSheet.create({
// });
