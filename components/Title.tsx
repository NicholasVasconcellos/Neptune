import { Text, View, useColorScheme, ViewProps, StyleProp, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "../Styles/Theme";

interface TitleProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export default function Title({ children, style, ...args }: TitleProps) {
  const themeName = useColorScheme();
  const currTheme = Colors[themeName ?? "light"];

  return (
    <View {...args}>
      <Text
        style={[
          {
            color: currTheme.text,
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
