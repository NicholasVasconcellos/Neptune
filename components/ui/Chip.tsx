import React from "react";
import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "./Text";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ChipProps {
  label?: string;
  children?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  compact?: boolean;
  className?: string;
}

export default function Chip({
  label,
  children,
  selected = false,
  onPress,
  onClose,
  compact = false,
  className = "",
}: ChipProps) {
  const colors = useThemeColors();

  const selectedClass = selected
    ? "bg-primary/20 border-primary"
    : "bg-background-card border-border";

  const padding = compact ? "px-2.5 py-1" : "px-3.5 py-1.5";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ selected }}
      className={`flex-row items-center gap-1 rounded-full border ${selectedClass} ${padding} ${className}`}
      style={({ pressed }) => (pressed && onPress ? { opacity: 0.7 } : undefined)}
    >
      <Text
        variant="body-sm"
        className={selected ? "text-primary font-medium" : "text-foreground"}
      >
        {label ?? children}
      </Text>
      {onClose && (
        <Pressable
          onPress={onClose}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label ?? ""}`}
        >
          <Ionicons name="close-circle" size={16} color={colors.foregroundMuted} />
        </Pressable>
      )}
    </Pressable>
  );
}
