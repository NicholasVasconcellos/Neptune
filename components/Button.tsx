import { StyleSheet, Pressable, PressableProps, useColorScheme, StyleProp, ViewStyle } from "react-native";
import React, { ReactNode } from "react";
import { Colors } from "../Styles/Theme";
import { typography } from "../Styles/Theme";
import ThemedText from "./ThemedText";
import { useRouter } from "expo-router";

// Button Component with icon, and colors use current theme
// Href Link, if button links to something
// ON Press = callbackfunction on click
// icon: button icon if any
// children get's the text content
interface ButtonProps extends PressableProps {
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const Button = ({ onClick, href, containerStyle, icon, children, ...args }: ButtonProps) => {
  // Get the Current theme name from the hook
  // Select the corresponding section of colors
  const themeName = useColorScheme();

  const currTheme = Colors[themeName ?? "light"];

  // if link provided, go to link on click
  const router = useRouter();

  function handlePress() {
    if (onClick) onClick();
    if (href != null) router.push(href as any);
  }

  return (
    // When Style is a function, passable will pass in the this object with the isPressed property
    <Pressable
      style={(arg) => [
        { backgroundColor: Colors.primary },
        styles.default,
        arg.pressed && styles.pressed,
        containerStyle,
      ]}
      onPress={handlePress}
      {...args}
    >
      {/* Display Icon if any */}
      {icon && icon}

      <ThemedText
        style={{
          fontWeight: typography.weights.semibold,
          fontSize: typography.sizes.xl,
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  default: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
    // justifyContent: "center",
    gap: 20,
  },

  pressed: {
    opacity: 0.5,
  },
});
