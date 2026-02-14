import { View, useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "../Styles/Theme";

import { AuthProvider } from "../context/AuthContext";

// Expo Renders Layout file by default
// Slot: Renders page content
// Stack: Renders page +  keeps the previous pages stored
const RootLayout = () => {
  const themeName = useColorScheme();

  const currTheme = Colors[themeName ?? "light"];

  // Use Stack Screen to setup the screen
  // headerShown = False to hide header on a page
  // Options>Title: name to set custom title
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: currTheme.background }}
        >
          {/* Screen Options: Global Options for all screens */}
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: currTheme.background },
            }}
          >
            {/* Register screens */}
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen
              name="(tabs)"
              options={{ title: "App" }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{
                title: "Login",
                headerShown: true,
                headerTransparent: true,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              name="(auth)/register"
              options={{
                title: "Create Account",
                headerShown: true,
                headerTransparent: true,
                headerTitle: "",
              }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default RootLayout;
