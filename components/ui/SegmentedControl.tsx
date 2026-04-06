import React from "react";
import { View, Pressable } from "react-native";
import Text from "./Text";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  options,
  selected,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="tablist"
      className={`flex-row rounded-lg bg-background-secondary overflow-hidden border border-border ${className}`}
    >
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={`flex-1 items-center py-2.5 px-3 ${
              isActive ? "bg-unit-active" : ""
            }`}
          >
            <Text
              variant="body-sm"
              className={`font-medium ${
                isActive ? "text-primary" : "text-foreground-muted"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
