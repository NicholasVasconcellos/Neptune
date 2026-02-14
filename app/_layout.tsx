import { useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { LightTheme, DarkTheme } from "../Styles/PaperTheme";

import { AuthProvider } from "../context/AuthContext";

// Expo Renders Layout file by default
// Slot: Renders page content
// Stack: Renders page +  keeps the previous pages stored
const RootLayout = () => {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
          >
            {/* Screen Options: Global Options for all screens */}
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: paperTheme.colors.background },
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
      </PaperProvider>
    </AuthProvider>
  );
};

export default RootLayout;
