import { Text, View, useColorScheme, ViewProps, StyleProp, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "../Styles/Theme";

interface ThemedTextProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function ThemedText({ children, style, ...args }: ThemedTextProps) {
  // Get the current theme from react natives hook that reads from the device
  const themeName = useColorScheme();

  const currTheme = Colors[themeName ?? "light"];
  // SEt the current theme within the Colors object

  return (
    // Pass any other arguments to the inner View compoenent if needed
    // Apply Style to the text componenet
    // SEt the text color to the currTheme's text property
    // Pass in the Children prop, which get's the text inside the compoenent
    // set is as the argumetn of the text component
    <View {...args}>
      <Text style={[{ color: currTheme.text }, style]}>{children}</Text>
    </View>
  );
}
