import React from "react";
import { View } from "react-native";

interface DividerProps {
  className?: string;
}

export default function Divider({ className = "" }: DividerProps) {
  return <View className={`h-px bg-border ${className}`} />;
}
