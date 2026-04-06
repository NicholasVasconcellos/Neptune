import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

interface LoadingIndicatorProps {
  size?: "small" | "large";
  className?: string;
}

export default function LoadingIndicator({
  size = "large",
  className = "",
}: LoadingIndicatorProps) {
  const colors = useThemeColors();

  return (
    <View
      className={`flex-1 items-center justify-center ${className}`}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
