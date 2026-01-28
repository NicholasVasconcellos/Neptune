import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { Colors } from "../Styles/Colors";

export default function Button({ style, ...args }) {
  return (
    // When Style is a function, passable will pass in the this object with the isPressed property
    <Pressable
      style={(arg) => [styles.default, arg.pressed && styles.pressed, style]}
      {...args}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },

  pressed: {
    opacity: 0.5,
  },
});
