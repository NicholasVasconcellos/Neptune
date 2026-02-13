import { StyleSheet, TextInput, useColorScheme } from "react-native";
import { Colors } from "../Styles/Theme";
import React from "react";
import { View } from "react-native-web";

import ThemedText from "./ThemedText";

/**
 * @param {import('react-native').TextInputProps & { styles?: import('react-native').StyleProp<import('react-native').TextStyle> }} props
 */
export default function ThemedInput({
  formTitle = "Sample Form",
  styles,
  ...args
}) {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  const localStyle = getStyles(theme);

  return (
    <View>
      <ThemedText style={localStyle.label}>{formTitle}</ThemedText>
      <TextInput
        style={[localStyle.input, styles]}
        {...args}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      padding: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 8,
      backgroundColor: theme.uiBackground,
      color: theme.text,
      padding: 20,
      borderRadius: 6,
    },
  });
