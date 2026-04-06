import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function IconButton({
  icon,
  size = 24,
  color = "var(--color-foreground)",
  onPress,
  disabled = false,
  className = "",
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      className={`items-center justify-center rounded-full p-2 ${disabled ? "opacity-40" : ""} ${className}`}
      style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}
