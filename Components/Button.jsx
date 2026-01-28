import { StyleSheet, Text, Pressable, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "../Styles/Theme";
import { typography } from "../Styles/Theme";
import ThemedText from "./ThemedText";

export default function Button({ style, icon, children, ...args }) {
  // Get the Current theme name from the hook
  // Select the corresponding section of colors
  const themeName = useColorScheme();

  const currTheme = Colors[themeName] || Colors["light"];

  return (
    // When Style is a function, passable will pass in the this object with the isPressed property
    <Pressable
      style={(arg) => [
        { backgroundColor: currTheme.background },
        styles.default,
        arg.pressed && styles.pressed,
        style,
      ]}
      {...args}
    >
      {/* Display Icon if any */}
      {icon && icon}
      
      <ThemedText
        style={{
          fontWeight: typography.weights.semibold,
          fontSize: typography.sizes.xl,
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
    gap: 20,
  },

  pressed: {
    opacity: 0.5,
  },
});



