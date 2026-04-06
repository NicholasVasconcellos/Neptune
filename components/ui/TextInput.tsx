import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  Pressable,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "./Text";
import { useThemeColors } from "../../hooks/useThemeColors";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  secureTextEntry?: boolean;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      errorMessage,
      className = "",
      containerClassName = "",
      secureTextEntry,
      ...props
    },
    ref,
  ) => {
    const colors = useThemeColors();
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const borderClass = error
      ? "border-danger"
      : focused
        ? "border-border-focused"
        : "border-border";

    const bgClass = focused ? "bg-input-focused" : "bg-background-input";

    return (
      <View className={`my-1.5 ${containerClassName}`}>
        {label && (
          <Text variant="label-sm" className="mb-1 ml-1">
            {label}
          </Text>
        )}
        <View
          className={`flex-row items-center rounded-md border ${borderClass} ${bgClass} px-3`}
        >
          <RNTextInput
            ref={ref}
            className={`flex-1 py-3 text-sm text-foreground ${className}`}
            placeholderTextColor={colors.placeholder}
            secureTextEntry={secureTextEntry && !passwordVisible}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {secureTextEntry && (
            <Pressable
              onPress={() => setPasswordVisible((v) => !v)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                passwordVisible ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.foregroundMuted}
              />
            </Pressable>
          )}
        </View>
        {error && errorMessage && (
          <Text variant="body-sm" className="mt-1 ml-1 text-danger">
            {errorMessage}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = "TextInput";
export default TextInput;
