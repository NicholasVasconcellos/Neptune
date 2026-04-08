import "@/global.css";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { LoadingIndicator } from "@/components/ui";

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingIndicator className="bg-background" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ title: "App" }} />
        <Stack.Screen
          name="athlete/[id]"
          options={{
            title: "Athlete",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(auth)/reset-password"
          options={{
            title: "Reset Password",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
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
        <Stack.Screen
          name="(auth)/forgot-password"
          options={{
            title: "Forgot Password",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-background">
            <RootNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default RootLayout;
