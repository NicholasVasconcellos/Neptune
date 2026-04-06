import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useThemeColors } from "../../hooks/useThemeColors";

const TabsLayout = () => {
  const colors = useThemeColors();

  return (
    <View className="flex-1 bg-background">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: { backgroundColor: colors.background },
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="house"
                size={24}
                color={focused ? colors.primary : colors.foreground}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="viewData"
          options={{
            title: "View Metrics",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="chart-line"
                size={24}
                color={focused ? colors.primary : colors.foreground}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="addTraining"
          options={{
            title: "New Training",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="scroll"
                size={24}
                color={focused ? colors.primary : colors.foreground}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="viewTraining"
          options={{
            title: "Start Training",
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="play"
                size={24}
                color={focused ? colors.primary : colors.foreground}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
