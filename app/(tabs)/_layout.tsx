import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const TabsLayout = () => {
  return (
    <View className="flex-1 bg-background">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4fc3f7",
          tabBarStyle: { backgroundColor: "var(--color-background)" },
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
                color={focused ? "#4fc3f7" : "var(--color-foreground)"}
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
                color={focused ? "#4fc3f7" : "var(--color-foreground)"}
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
                color={focused ? "#4fc3f7" : "var(--color-foreground)"}
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
                color={focused ? "#4fc3f7" : "var(--color-foreground)"}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
