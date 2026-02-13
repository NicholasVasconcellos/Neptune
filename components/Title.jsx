import { StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";
import { Colors } from "../Styles/Theme";

export default function Title({ children, style, ...args }) {
  const themeName = useColorScheme();
  const currTheme = Colors[themeName] || Colors["light"];

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
