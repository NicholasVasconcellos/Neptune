import { StyleSheet, TextInput, useColorScheme } from "react-native";
import { Colors } from "../Styles/Colors";
import React from "react";


/**
 * @param {import('react-native').TextInputProps & { styles?: import('react-native').StyleProp<import('react-native').TextStyle> }} props
 */
export default function ThemedInput({ styles, ...args }) {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
        },
        styles
      ]}
      {...args}
    />
  );
}

const styles = StyleSheet.create({});
