import { StyleProp, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { Text } from "react-native-paper";

interface TitleProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function Title({ children, style, ...args }: TitleProps) {
  return (
    <Text
      variant="headlineMedium"
      style={[
        {
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 40,
        },
        style,
      ]}
      {...args}
    >
      {children}
    </Text>
  );
}
