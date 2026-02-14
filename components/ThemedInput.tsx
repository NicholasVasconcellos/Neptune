import { StyleSheet, TextInput, TextInputProps, useColorScheme, StyleProp, TextStyle } from "react-native";
import { Colors } from "../Styles/Theme";
import React from "react";
import { View } from "react-native";

import ThemedText from "./ThemedText";

interface ThemedInputProps extends TextInputProps {
  formTitle?: string;
  styles?: StyleProp<TextStyle>;
}

export default function ThemedInput({
  formTitle = "Sample Form",
  styles,
  ...args
}: ThemedInputProps) {
  const theme = Colors[useColorScheme() ?? "light"];

  const localStyle = getStyles(theme);

  return (
    <View style={localStyle.container}>
      <ThemedText style={localStyle.label}>{formTitle}</ThemedText>
      <TextInput style={[localStyle.input, styles]} {...args} />
    </View>
  );
}

const getStyles = (theme: (typeof Colors)["dark"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
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
    },
  });
