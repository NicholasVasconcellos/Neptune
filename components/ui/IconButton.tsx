import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/hooks/useThemeColors";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

export default function IconButton({
  icon,
  size = 24,
  color,
  onPress,
  disabled = false,
  className = "",
  accessibilityLabel,
}: IconButtonProps) {
  const colors = useThemeColors();
  const resolvedColor = color ?? colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      className={`items-center justify-center rounded-full p-2 ${disabled ? "opacity-40" : ""} ${className}`}
      style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
    >
      <Ionicons name={icon} size={size} color={resolvedColor} />
    </Pressable>
  );
}
