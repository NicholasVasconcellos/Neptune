import "../global.css";
import { useColorScheme } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Stack } from "expo-router";

import { AuthProvider } from "../context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-background">
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="(tabs)" options={{ title: "App" }} />
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
