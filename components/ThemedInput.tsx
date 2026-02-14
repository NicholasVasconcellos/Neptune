import { StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native-paper";
import React from "react";
import { TextInputProps } from "react-native";

interface ThemedInputProps {
  formTitle?: string;
  styles?: StyleProp<TextStyle>;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
}

export default function ThemedInput({
  formTitle = "Sample Form",
  styles: customStyle,
  ...args
}: ThemedInputProps) {
  return (
    <TextInput
      label={formTitle}
      mode="outlined"
      style={[{ marginVertical: 6 }, customStyle]}
      {...args}
    />
  );
}
