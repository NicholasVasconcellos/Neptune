import React from "react";
import { TouchableOpacity, Text, StyleSheet, useColorScheme } from "react-native";
import { colors, typography, spacing, radii } from "../../styles/theme";


/**
 * Reusable button with primary, secondary, and danger variants
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler callback
 * @param {string} [props.variant='primary'] - Button style variant
 * @param {Object} [props.style] - Additional button styles
 * @param {Object} [props.textStyle] - Additional text styles
 * @param {number} [props.flex] - Flex grow value
 * @returns {JSX.Element} The button component
 */
export const Button = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  flex, // in react native, flex is flex-grow
}) => {
  // Get the specific varaint style, if not existing set to primary (short circuiting sytnax)
  const variantStyles = VARIANTS[variant] || VARIANTS.primary;


  // Return the compoenent 
  return (
    <TouchableOpacity
      // set the style property: apply all the styles listed in the array, left to right
      // later ones will overrid
      style={[
        styles.button, // Default Button Styles
        variantStyles.button, // Variant Specific Button Styles
        flex && { flex }, // flex only if flex is "truthy" (not null) (short circuiting)
        style, // Style passed in to the button component
      ]}
      onPress={onPress} // set the OnPress callback function to the one passed in at the button component
      activeOpacity={0.7} // Set the TouchableOpacity compoene'ts property
    >
      <Text style={
        // Send the default text style, the variant style and the one passed in at the button
        // text style from styles agrument, variant's text style, textStyle argument
        [styles.text, variantStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};


// Default Styles for button (regardless of type)
// Create a react native stylehseet object (validated and mapped to id)
// SEt default style for Button adn Text in the button component
const styles = StyleSheet.create({
  button: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    alignItems: "center",
  },
  text: {
    color: colors.dark.text,
  },
});


// Style for each type of button (primary, secondary, danger)
// Object with a list of themes, each with style properties for button and text
const VARIANTS = {
  primary: {
    button: {
      backgroundColor: colors.success,
    },
    text: {
      color: colors.text,
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
    },
  },
  secondary: {
    button: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    text: {
      color: colors.textSecondary,
      fontSize: typography.sizes.l,
      fontWeight: typography.weights.semibold,
    },
  },
  danger: {
    button: {
      borderWidth: 2,
      borderColor: colors.dangerLight,
      backgroundColor: colors.dangerBackground,
    },
    text: {
      color: colors.danger,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
  },
};

