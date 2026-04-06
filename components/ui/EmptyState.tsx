import React from "react";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "./Text";
import { useThemeColors } from "../../hooks/useThemeColors";

interface EmptyStateProps {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export default function EmptyState({
  message,
  icon,
  className = "",
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View className={`items-center justify-center py-16 px-6 ${className}`}>
      {icon && (
        <Ionicons
          name={icon}
          size={40}
          color={colors.foregroundMuted}
          style={{ marginBottom: 12 }}
        />
      )}
      <Text variant="body" className="text-foreground-muted text-center">
        {message}
      </Text>
    </View>
  );
}
