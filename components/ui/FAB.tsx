import React from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "./Text";
import { useThemeColors } from "../../hooks/useThemeColors";

interface FABProps {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress?: () => void;
  extended?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

export default function FAB({
  icon,
  label,
  onPress,
  extended = true,
  className = "",
  accessibilityLabel,
}: FABProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      className={`flex-row items-center gap-2 rounded-2xl bg-primary px-4 py-3.5 shadow-lg ${className}`}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <Ionicons name={icon} size={22} color={colors.onPrimary} />
      {extended && label && (
        <Text className="text-on-primary font-semibold text-sm">{label}</Text>
      )}
    </Pressable>
  );
}
