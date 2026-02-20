import { StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
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
  secureTextEntry,
  ...rest
}: ThemedInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TextInput
      label={formTitle}
      mode="outlined"
      style={[{ marginVertical: 6 }, customStyle]}
      secureTextEntry={secureTextEntry && !passwordVisible}
      right={
        secureTextEntry ? (
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible((prev) => !prev)}
          />
        ) : undefined
      }
      {...rest}
    />
  );
}
