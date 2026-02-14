import { StyleProp, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { Text } from "react-native-paper";

interface ThemedTextProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: "displayLarge" | "displayMedium" | "displaySmall" | "headlineLarge" | "headlineMedium" | "headlineSmall" | "titleLarge" | "titleMedium" | "titleSmall" | "bodyLarge" | "bodyMedium" | "bodySmall" | "labelLarge" | "labelMedium" | "labelSmall";
}

export default function ThemedText({ children, style, variant = "bodyMedium", ...args }: ThemedTextProps) {
  return (
    <Text variant={variant} style={style} {...args}>
      {children}
    </Text>
  );
}
